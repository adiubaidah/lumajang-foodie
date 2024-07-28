import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
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
  async modify(@Query('name-file') nameFile: string) {
    return await this.scrappingService.modify({ nameFile });
  }

  @Put('partialize')
  async partialize(
    @Query('name-file') nameFile: string,
    @Query('slice') slice: number,
  ) {
    return await this.scrappingService.partialize({ nameFile, slice });
  }

  @Put('add-atribute')
  async addAtribute(@Query('name-file') nameFile: string) {
    return await this.scrappingService.addAtribute({ nameFile });
  }

  @Put('group-subdistrict')
  async groupSubdistrict() {
    return await this.scrappingService.groupingBySubdistrict();
  }

  @Post('insert')
  async insert(@Query('name-file') nameFile: string) {
    return await this.scrappingService.insert({ nameFile });
  }
}
