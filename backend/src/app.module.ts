import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScrappingModule } from './scrapping/scrapping.module';
import { SubdistrictModule } from './subdistrict/subdistrict.module';
import { PlaceModule } from './place/place.module';
import { join } from 'path';
import { UserFollowModule } from './user-follow/user-follow.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    UserModule,
    ScrappingModule,
    SubdistrictModule,
    PlaceModule,
    UserFollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
