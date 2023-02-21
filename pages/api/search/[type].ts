import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { getSession } from 'next-auth/react';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as Unsplash from '@/types/unsplash';
import unsplashClient from '@/lib/unsplash';
import { connect } from '@/lib/sequelize';
import * as Api from '@/types/api';
import prisma from '@/lib/prisma';
import type { RecentQuery } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Unsplash.Search.Photos
    | (Unsplash.Search.Photos & { recentQueries: RecentQuery[] })
    | Unsplash.Search.Collections
    | Api.Error
    | undefined
  >,
) {
  try {
    // run cors middleware
    await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
    });

    // await connect();
    const { type } = req.query;

    if (req.method === 'GET' && type === 'photos') {
      const query: string = req.query.query as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 20;

      if (query) {
        const orderBy: Unsplash.Search.SearchPhotoOrderBy | undefined = req
          .query.orderBy as Unsplash.Search.SearchPhotoOrderBy | undefined;

        const { response } = await unsplashClient.search.getPhotos({
          query,
          page,
          perPage,
          orderBy: orderBy || Unsplash.Search.SearchPhotoOrderBy.RELEVANT,
        });

        // at the first search
        if (page === 1) {
          const session = await getSession({ req });

          if (session) {
            const me = await prisma.user.findUnique({
              where: { email: session?.user?.email! },
            });

            if (me) {
              // add/update the passed recent query
              // read 5 latest queries
              await prisma.recentQuery.upsert({
                where: { queryUserId: { query, userId: me.id } },
                create: { query, userId: me.id },
                update: { timestamp: new Date() },
              });

              const _recentQueries = await prisma.recentQuery.findMany({
                where: { userId: me.id },
                orderBy: { timestamp: 'desc' },
                take: 5,
              });

              return res.status(StatusCodes.OK).send({
                ...response,
                recentQueries: _recentQueries || [],
              } as Unsplash.Search.Photos & {
                recentQueries: RecentQuery[];
              });
            }
          }
        }

        res.status(StatusCodes.OK).send(response as Unsplash.Search.Photos);
      } else {
        const orderBy: Unsplash.Search.ListPhotosOrderBy | undefined = req.query
          .orderBy as Unsplash.Search.ListPhotosOrderBy | undefined;

        const { response } = await unsplashClient.photos.list({
          page,
          perPage,
          orderBy: orderBy || Unsplash.Search.ListPhotosOrderBy.LATEST,
        });

        // first page fetch
        if (page === 1) {
          const session = await getSession({ req });

          if (session) {
            const me = await prisma.user.findUnique({
              where: { email: session?.user?.email! },
            });

            if (me) {
              // read 5 latest queries
              const recentQueries: RecentQuery[] =
                await prisma.recentQuery.findMany({
                  where: { userId: me.id },
                  orderBy: { timestamp: 'desc' },
                  take: 5,
                });

              return res.status(StatusCodes.OK).send({
                ...response,
                recentQueries,
              } as Unsplash.Search.Photos & {
                recentQueries: RecentQuery[];
              });
            }
          }
        }

        res.status(StatusCodes.OK).json(response as Unsplash.Search.Photos);
      }
    }

    if (req.method === 'GET' && type === 'collections') {
      const query: string = req.query.query as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 20;

      if (query) {
        const { response } = await unsplashClient.search.getCollections({
          query,
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      } else {
        const { response } = await unsplashClient.collections.list({
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      }
    }

    if (req.method === 'GET' && type === 'topics') {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 20;

      const { response } = await unsplashClient.topics.list({ page, perPage });

      res.status(StatusCodes.OK).json(response);
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
