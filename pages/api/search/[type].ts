import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as Unsplash from '@/types/unsplash';
import unsplashClient from '@/lib/unsplash';
import { connect } from '@/lib/sequelize';
import * as Api from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Unsplash.Search.Photos | Unsplash.Search.Collections | Api.Error | undefined
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

        res.status(StatusCodes.OK).json(response);
      } else {
        const orderBy: Unsplash.Search.ListPhotosOrderBy | undefined = req.query
          .orderBy as Unsplash.Search.ListPhotosOrderBy | undefined;

        console.log(page, perPage, orderBy);

        const { response } = await unsplashClient.photos.list({
          page,
          perPage,
          orderBy: orderBy || Unsplash.Search.ListPhotosOrderBy.LATEST,
        });

        res.status(StatusCodes.OK).json(response);
      }
    }

    if (req.method === 'GET' && type === 'collections') {
      const query: string = req.query.query as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 10;

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
      const perPage: number = parseInt(req.query.perPage as string, 10) || 10;

      const { response } = await unsplashClient.topics.list({ page, perPage });

      res.status(StatusCodes.OK).json(response);
    }
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
