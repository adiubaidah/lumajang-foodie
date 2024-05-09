import { UnauthorizedException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
// const
import { Request } from 'express';

export const extractFromCookie = (request: Request) => {
  if (!request.cookies.access_token) {
    throw new UnauthorizedException();
  }
  const [type, token] = request.cookies.access_token.split(' ');
  return type === 'Bearer' ? token : undefined;
  //   return request.cookies.access_token;
};

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\W-]+/g, '') +
    '-' +
    customAlphabet('12345678abcd', 5)
  );
}
