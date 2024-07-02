import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { EventEmitter } from 'node:events';

EventEmitter.defaultMaxListeners = 20;

async function bootstrap() {
  process.setMaxListeners(15);
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //yang tidak ada di dto akan di remove,
      forbidNonWhitelisted: true,
      transform: true, // memjadi objek
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
