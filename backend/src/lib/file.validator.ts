import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new BadRequestException('Invalid file type'), false);
  }

  if (file.size > 1500000) {
    return callback(new BadRequestException('File is too large'), false);
  }

  callback(null, true);
};
