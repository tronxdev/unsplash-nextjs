import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import unsplash from '@/lib/unsplash';
// import { Nullable } from '@/types/typescript';
import * as Unsplash from '@/types/unsplash';
import * as Api from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Unsplash.Search.Photos | Api.Error | undefined>,
) {
  try {
    // run cors middleware
    await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
    });

    if (req.method === 'GET') {
      const topicId: string = req.query.id as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 20;

      const { response } = await unsplash.topics.getPhotos({
        topicIdOrSlug: topicId,
        page,
        perPage,
      });

      res.status(StatusCodes.OK).json(response as Unsplash.Search.Photos);
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
