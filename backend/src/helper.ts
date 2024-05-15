import { UnauthorizedException } from '@nestjs/common';
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
      .replace(/[^a-z0-9-]/g, '') +
    '-' +
    makeid(5)
  );
}

export function makeid(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
