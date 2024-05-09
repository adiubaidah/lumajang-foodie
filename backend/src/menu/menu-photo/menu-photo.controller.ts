import { Controller } from '@nestjs/common';
import { MenuPhotoService } from './menu-photo.service';

@Controller('menu-photo')
export class MenuPhotoController {
  constructor(private menuPhotoService: MenuPhotoService) {}
}
