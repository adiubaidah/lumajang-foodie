import { Controller, Get, Post } from '@nestjs/common';
import { ScrappingService } from './scrapping.service';

@Controller('scrapping')
export class ScrappingController {
  constructor(private scrappingService: ScrappingService) {}

  @Get()
  async start() {
    return await this.scrappingService.scrapping();
  }

  @Post()
  async insert() {
    return await this.scrappingService.insert();
  }
}
