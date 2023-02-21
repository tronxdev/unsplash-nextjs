import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { getSession } from 'next-auth/react';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import prisma from '@/lib/prisma';
import type {
  UnsplashFavorite,
  UnsplashPhoto,
  UnsplashPhotoUrl,
  UnsplashPhotoLink,
  UnsplashUser,
  UnsplashUserProfileImage,
} from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // run cors middleware
    await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
    });

    const session = await getSession({ req });

    if (!session) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
      return;
    }

    const me = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
    });

    if (!me) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
      return;
    }

    if (req.method === 'GET') {
      const favorites: UnsplashFavorite[] =
        await prisma.unsplashFavorite.findMany({ where: { userId: me.id } });

      const unsplashPhotos: UnsplashPhoto[] =
        await prisma.unsplashPhoto.findMany({
          where: { id: { in: favorites.map((f) => f.photoId) } },
        });

      const [
        _unsplashPhotoUrls,
        _unsplashPhotoLinks,
        _unsplashUsers,
        _unsplashUserProfileImages,
      ] = await Promise.allSettled([
        prisma.unsplashPhotoUrl.findMany({
          where: { photoId: { in: favorites.map((f) => f.photoId) } },
        }),
        prisma.unsplashPhotoLink.findMany({
          where: { photoId: { in: favorites.map((f) => f.photoId) } },
        }),
        prisma.unsplashUser.findMany({
          where: { id: { in: unsplashPhotos.map((p) => p.userId) } },
        }),
        prisma.unsplashUserProfileImage.findMany({
          where: { userId: { in: unsplashPhotos.map((p) => p.userId) } },
        }),
      ]);

      const unsplashPhotoUrls: UnsplashPhotoUrl[] =
        _unsplashPhotoUrls.status === 'fulfilled'
          ? _unsplashPhotoUrls.value
          : [];
      const unsplashPhotoLinks: UnsplashPhotoLink[] =
        _unsplashPhotoLinks.status === 'fulfilled'
          ? _unsplashPhotoLinks.value
          : [];
      const unsplashUsers: UnsplashUser[] =
        _unsplashUsers.status === 'fulfilled' ? _unsplashUsers.value : [];
      const unsplashUserProfileImages: UnsplashUserProfileImage[] =
        _unsplashUserProfileImages.status === 'fulfilled'
          ? _unsplashUserProfileImages.value
          : [];

      return res.status(StatusCodes.OK).send(
        unsplashPhotos.map((p) => {
          const urls: UnsplashPhotoUrl | undefined = unsplashPhotoUrls.find(
            (u) => u.photoId === p.id,
          );
          const links: UnsplashPhotoLink | undefined = unsplashPhotoLinks.find(
            (l) => l.photoId === p.id,
          );
          const user: UnsplashUser | undefined = unsplashUsers.find(
            (u) => u.id === p.userId,
          );
          const userProfileImage: UnsplashUserProfileImage | undefined =
            unsplashUserProfileImages.find((i) => i.userId === p.userId);
          return {
            ...p,
            urls,
            links,
            user: {
              ...user,
              profile_image: userProfileImage,
            },
          };
        }),
      );
    }

    if (req.method === 'POST') {
      const { photo, liked } = req.body;

      const {
        id: photoId,
        created_at,
        updated_at,
        alt_description,
        blur_hash,
        color,
        description,
        height,
        likes,
        promoted_at,
        width,
        urls,
        links,
        user,
      } = photo;

      const {
        id: userId,
        bio,
        first_name,
        instagram_username,
        last_name,
        location,
        name,
        portfolio_url,
        total_collections,
        total_likes,
        total_photos,
        twitter_username,
        username,
        accepted_tos,
        profile_image,
      } = user;

      // write the photo creator to db
      await prisma.unsplashUser.upsert({
        where: { id: userId },
        create: {
          id: userId,
          bio,
          first_name,
          instagram_username,
          last_name,
          location,
          name,
          portfolio_url,
          total_collections,
          total_likes,
          total_photos,
          twitter_username,
          username,
          accepted_tos,
        },
        update: {
          bio,
          first_name,
          instagram_username,
          last_name,
          location,
          name,
          portfolio_url,
          total_collections,
          total_likes,
          total_photos,
          twitter_username,
          username,
          accepted_tos,
        },
      });

      // write the photo creator's profile image to db
      await prisma.unsplashUserProfileImage.upsert({
        where: { userId },
        create: { ...profile_image, userId },
        update: { ...profile_image, userId },
      });

      // write the photo to db
      await prisma.unsplashPhoto.upsert({
        where: { id: photoId },
        create: {
          id: photoId,
          created_at,
          updated_at,
          alt_description,
          blur_hash,
          color,
          description,
          height,
          likes,
          promoted_at,
          width,
          userId,
        },
        update: {
          created_at,
          updated_at,
          alt_description,
          blur_hash,
          color,
          description,
          height,
          likes,
          promoted_at,
          width,
          userId,
        },
        include: {
          urls: true,
          links: true,
        },
      });

      // write the photo urls to db
      await prisma.unsplashPhotoUrl.upsert({
        where: { photoId },
        create: { ...urls, photoId },
        update: { ...urls, photoId },
      });

      // write the photo links to db
      await prisma.unsplashPhotoLink.upsert({
        where: { photoId },
        create: { ...links, photoId },
        update: { ...links, photoId },
      });

      if (liked) {
        await prisma.unsplashFavorite.upsert({
          where: { userPhotoId: { photoId, userId: me.id } },
          create: { photoId: photo.id, userId: me.id },
          update: { photoId: photo.id, userId: me.id },
        });
      } else {
        await prisma.unsplashFavorite.delete({
          where: { userPhotoId: { photoId, userId: me.id } },
        });
      }

      return res.status(StatusCodes.OK).send({});
    }
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
