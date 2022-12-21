'use client';

import Dexie, { Table } from 'dexie';
import _ from 'lodash';

interface RecentQuery {
  id?: number;
  query?: string;
  timestamp?: number;
}

interface PhotoLike {
  id?: number;
  photoId?: string;
  timestamp?: number;
}

//
// Declare Database
//
class UnsplashDB extends Dexie {
  public recentQueries!: Table<RecentQuery, number>; // id is number in this case
  public photoLikes!: Table<PhotoLike, number>;

  public constructor() {
    super('UnsplashDB');
    this.version(1).stores({
      recentQueries: '++id,query,timestamp',
      photoLikes: '++id,photoId,timestamp',
    });
  }
}

const db = new UnsplashDB();

/**
 * @name addRecentQuery
 * @param query
 * @description stores a submitted search query with timestamp
 */
export async function addRecentQuery(query: string) {
  await db.transaction('rw', db.recentQueries, async () => {
    try {
      await db.recentQueries.add({ query, timestamp: new Date().getTime() });
    } catch (e) {
      throw e;
    }
  });
}

/**
 * @name getRecentQueries
 * @param limit number of the queries to return: if -1, then all; if over -1, then limited; otherwise, empty;
 * @param onlyUnique whether unique queries are returned or not
 * @returns array of recent queries
 * @description returns limited number of recent queries
 */
export async function getRecentQueries(
  limit: number = -1,
  onlyUnique: boolean = false,
): Promise<RecentQuery[]> {
  return await db.transaction('rw', db.recentQueries, async () => {
    try {
      let allQueries: RecentQuery[] = [];

      if (limit === -1) {
        await db.recentQueries.reverse().each(function (q) {
          allQueries.push(q);
        });
      } else if (limit > -1) {
        await db.recentQueries
          .limit(limit)
          .reverse()
          .each(function (q) {
            allQueries.push(q);
          });
      } else {
        allQueries = [];
      }

      if (onlyUnique) {
        return _.uniqBy(allQueries, 'query');
      } else {
        return allQueries;
      }
    } catch (e) {
      throw e;
    }
  });
}

/**
 * @name getPhotoLikes
 * @description get IDs of all liked photos
 */
export async function getPhotoLikes(): Promise<PhotoLike[]> {
  return await db.transaction('rw', db.photoLikes, async () => {
    try {
      let likes: PhotoLike[] = [];
      await db.photoLikes.each((p) => {
        likes.push(p);
      });
      return likes;
    } catch (e) {
      throw e;
    }
  });
}

/**
 * @name addPhotoLike
 * @param photoId
 * @description stores ID of liked photo with timestamp
 */
export async function addPhotoLike(photoId: string) {
  await db.transaction('rw', db.photoLikes, async () => {
    try {
      await db.photoLikes.add({ photoId, timestamp: new Date().getTime() });
    } catch (e) {
      throw e;
    }
  });
}

/**
 * @name addPhotoLike
 * @param photoId
 * @description delete a photo like by photo's ID
 */
export async function deletePhotoLike(photoId: string) {
  await db.transaction('rw', db.photoLikes, async () => {
    try {
      const like = await db.photoLikes.get({ photoId });
      if (like) {
        await db.photoLikes.delete(like.id as number);
      }
    } catch (e) {
      throw e;
    }
  });
}
