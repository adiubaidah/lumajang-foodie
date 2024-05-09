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
import { MenuModule } from './menu/menu.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';

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
    MenuModule,
    MessageModule,
    ConversationModule,
    // MessageEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
