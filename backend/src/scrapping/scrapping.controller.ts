import { EventEmitter } from 'events';
import {
  Controller,
  Delete,
  Get,
  OnModuleInit,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ScrappingService } from './scrapping.service';

@Controller('scrapping')
export class ScrappingController {
  constructor(private scrappingService: ScrappingService) {}

  @Get('start')
  async start(@Query('q') query: string) {
    return await this.scrappingService.scrap(query);
  }

  @Delete('duplicate')
  async deleteDuplicate() {
    return await this.scrappingService.removeDuplicate();
  }

  @Put('modify')
  async modify() {
    return await this.scrappingService.modify();
  }

  @Put('group-subdistrict')
  async groupSubdistrict() {
    return await this.scrappingService.groupingBySubdistrict();
  }

  @Post('insert')
  async insert() {
    return await this.scrappingService.insert();
  }
}
