// const
import { Request } from 'express';

export const extractToken = (request: Request): string | undefined => {
  // First, try to extract the token from the Authorization header
  if (request.headers.authorization) {
    const [type, token] = request.headers.authorization.split(' ');
    if (type === 'Bearer') {
      return token;
    }
  }

  // If the token is not in the Authorization header, try to extract it from cookies
  if (request.cookies.access_token) {
    const [type, token] = request.cookies.access_token.split(' ');
    if (type === 'Bearer') {
      return token;
    }
  }

  // If the token is neither in the Authorization header nor in cookies, return undefined
  return undefined;
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
export function sumArray(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}
