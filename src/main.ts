import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import type { FastifyCookie, FastifyCookieOptions } from '@fastify/cookie';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: {
      origin: '*', //TODO: CHANGE
    }}
  );
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CIPILAB API')
    .setDescription('API documentation for CIPILAB')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );

  await app.register(fastifyCookie as any, {
    secret: appConfig.auth.cookie.secret,
    httpOnly: true,
    sameSite: 'strict',
  });

  await app.listen(appConfig.port, '127.0.0.1');
}
bootstrap();
