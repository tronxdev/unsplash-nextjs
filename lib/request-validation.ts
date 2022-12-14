import { NextRequest, NextResponse } from 'next/server';
import { ValidationChain, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export default function validateRequest(validations: ValidationChain[]) {
  return async (req: NextRequest) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: `request validation failed. ${JSON.stringify({
          errors: errors.array(),
        })}`,
      }),
      {
        status: StatusCodes.BAD_REQUEST,
        headers: { 'content-type': 'application/json' },
      },
    );
  };
}
