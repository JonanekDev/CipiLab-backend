import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true, //For nginx proxy
    }),
    {
      logger: new ConsoleLogger({
        prefix: 'CIPILAB',
        timestamp: true,
      }),
      cors: {
        origin: '*', //TODO: CHANGE
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationException(
          validationErrors.map((error) => {
            const constraints = error.constraints
              ? Object.values(error.constraints)
              : [];
            return `${error.property}: ${constraints.join(', ')}`;
          }),
        );
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

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

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.register(fastifyCookie as any, {
    secret: appConfig.auth.cookie.secret,
    httpOnly: true,
    sameSite: 'strict',
  });

  await app.listen(appConfig.port, '127.0.0.1');
}
bootstrap();
