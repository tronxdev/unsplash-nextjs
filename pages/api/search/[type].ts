import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import unsplash from '@/lib/unsplash';
import { connect } from '@/lib/sequelize';
import * as Unsplash from '@/types/unsplash';
import * as Api from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Unsplash.Search.Photos | Unsplash.Search.Collections | Api.Error | undefined
  >,
) {
  try {
    // await connect();
    const { type } = req.query;

    if (req.method === 'GET' && type === 'photos') {
      const query: string = req.query.query as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 10;

      if (query) {
        const { response } = await unsplash.search.getPhotos({
          query,
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      } else {
        const { response } = await unsplash.photos.list({
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      }
    }

    if (req.method === 'GET' && type === 'collections') {
      const query: string = req.query.query as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 10;

      if (query) {
        const { response } = await unsplash.search.getCollections({
          query,
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      } else {
        const { response } = await unsplash.collections.list({
          page,
          perPage,
        });

        res.status(StatusCodes.OK).json(response);
      }
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
