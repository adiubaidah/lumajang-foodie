import { Controller, Get } from '@nestjs/common';
import { PlacePreferenceService } from './place-preference.service';
@Controller('place-preference')
export class PlacePreferenceController {
  constructor(private placePreferenceService: PlacePreferenceService) {}

  @Get()
  async all() {
    return await this.placePreferenceService.all();
  }
}
