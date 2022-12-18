import { NextRequest } from 'next/server';
import { query } from 'express-validator';
import validateRequest from '@/lib/request-validation';

export function middleware(request: NextRequest) {
  if (
    request.method === 'GET' &&
    request.nextUrl.pathname.startsWith('/search')
  ) {
    const res = validateRequest([
      query('query').isString(),
      query('page').isNumeric(),
      query('perPage').isNumeric(),
      query('orderBy').isIn([
        'latest',
        'oldest',
        'popular',
        'relevant',
        'featured',
        'position',
      ]),
    ]);

    return res;
  }
}
