import { Controller, Get } from '@nestjs/common';
import { SubdistrictService } from './subdistrict.service';

@Controller('subdistrict')
export class SubdistrictController {
  constructor(private subdistrictService: SubdistrictService) {}

  @Get()
  async all() {
    return await this.subdistrictService.get();
  }
}
