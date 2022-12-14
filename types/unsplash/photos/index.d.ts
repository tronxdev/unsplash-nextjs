import { Nullable } from '@/types/typescript';
import { Entity } from '@/types/unsplash/entities';
import * as User from '@/types/unsplash/users';
import * as Collection from '@/types/unsplash/collections';

interface StatValue {
  value: number;
  date: string;
}

interface Stat {
  total: number;
  historical: {
    change: number;
    quantity: number;
    resolution: string;
    values: StatValue[];
  };
}

export interface Stats extends Entity {
  views: Stat;
  downloads: Stat;
}

export interface VeryBasic extends Entity {
  created_at: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    small_s3: string;
    thumb: string;
  };
}

export interface Basic extends VeryBasic {
  alt_description: Nullable<string>;
  blur_hash: Nullable<string>;
  color: Nullable<string>;
  description: Nullable<string>;
  height: number;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at: Nullable<string>;
  width: number;
  user: User.Basic;
}

interface ExifAndLocation {
  exif: {
    make: Nullable<string>;
    model: Nullable<string>;
    exposure_time: Nullable<string>;
    aperture: Nullable<string>;
    focal_length: Nullable<string>;
    iso: Nullable<number>;
  };
  location: {
    city: Nullable<string>;
    country: Nullable<string>;
    /** full string representation of the location, including `city` and `country` if they exist. */
    name: Nullable<string>;
    position: {
      latitude: Nullable<number>;
      longitude: Nullable<number>;
    };
  };
}

declare type RelatedCollectionsType = 'related' | 'collected';
export interface Full extends Basic, ExifAndLocation {
  related_collections: {
    type: RelatedCollectionsType;
    results: Collection.Basic[];
    total: number;
  };
}

export interface ISearchPhotos<A> {
  results: A[];
  total: number;
  total_pages: number;
}

export type ISocial = Record<
  'instagram_username' | 'twitter_username' | 'portfolio_url',
  string
>;

export type IProfileImage = Record<'small' | 'medium' | 'large', string>;

export interface IBadge {
  title: string;
  primary: boolean;
  slug: string;
  link: string;
}

export type IUserLinks = Record<
  'self' | 'html' | 'photos' | 'likes' | 'portfolio',
  string
>;

export type IPhotoUrls = Record<
  'raw' | 'full' | 'regular' | 'small' | 'thumb',
  string
>;

export type IPhotoLinks = Record<
  'self' | 'html' | 'download' | 'download_location',
  string
>;

export interface IUser extends ISocial {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  followed_by_user: boolean;
  followers_count: number;
  following_count: number;
  downloads: number;
  social: ISocial;
  profile_image: IProfileImage;
  badge: IBadge;
  links: IUserLinks;
}

export interface IPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blue_hash: string;
  likes: number;
  liked_by_user: boolean;
  description: string;
  user: IUser;
  urls: IPhotoUrls;
  links: IPhotoLinks;
}

export interface ICollection {
  id: string;
  title: string;
  description: string;
  published_at: string;
  last_collected_at: string;
  updated_at: string;
  total_photos: number;
  private: boolean;
  share_key: string;
  cover_photo: IPhoto;
  user: IUser;
}
