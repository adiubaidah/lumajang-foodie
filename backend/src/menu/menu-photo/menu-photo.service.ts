import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MenuPhotoService {
  constructor(private prismaService: PrismaService) {}
  
}
