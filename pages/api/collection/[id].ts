import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import unsplash from '@/lib/unsplash';
import * as Unsplash from '@/types/unsplash';
import * as Api from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Unsplash.Collection.Basic | Api.Error | undefined>,
) {
  try {
    // run cors middleware
    await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
    });

    if (req.method === 'GET') {
      const collectionId: string = req.query.id as string;

      await unsplash.topics.list();
      const { response } = await unsplash.collections.get({
        collectionId,
      });

      res.status(StatusCodes.OK).json(response);
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
