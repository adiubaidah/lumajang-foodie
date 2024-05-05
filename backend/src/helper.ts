import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const extractFromCookie = (request: Request) => {
  if (!request.cookies.access_token) {
    throw new UnauthorizedException();
  }
  const [type, token] = request.cookies.access_token.split(' ');
  return type === 'Bearer' ? token : undefined;
  //   return request.cookies.access_token;
};
