import { Controller, Get, Query } from '@nestjs/common';
import { SubdistrictService } from './subdistrict.service';

@Controller('subdistrict')
export class SubdistrictController {
  constructor(private subdistrictService: SubdistrictService) {}

  @Get()
  async all(@Query('place') place: number) {
    return await this.subdistrictService.all(place);
  }
}
