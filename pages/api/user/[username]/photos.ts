import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import unsplash from '@/lib/unsplash';
import * as Unsplash from '@/types/unsplash';
import * as Api from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Unsplash.Search.Photos | Api.Error | undefined>,
) {
  try {
    if (req.method === 'GET') {
      const username: string = req.query.username as string;
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const perPage: number = parseInt(req.query.perPage as string, 10) || 10;
      const orderBy: string | undefined = req.query.orderBy as
        | string
        | undefined;
      const orientation: Unsplash.Search.Orientation | undefined = req.query
        .orientation as Unsplash.Search.Orientation | undefined;

      const { response } = await unsplash.users.getPhotos({
        username,
        page,
        perPage,
        orderBy,
        orientation,
      });

      res.status(StatusCodes.OK).json(response as Unsplash.Search.Photos);
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
