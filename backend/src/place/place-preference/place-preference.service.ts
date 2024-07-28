import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class PlacePreferenceService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.placePreferences.findMany();
  }
}
