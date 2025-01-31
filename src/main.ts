import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /*Compression*/
  app.use(compression());
  /*Cors*/
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({});
  /*App entry point*/
  app.setGlobalPrefix('api');
  /*Swagger*/
  const config = new DocumentBuilder()
    .setTitle('Chat Group')
    .setDescription('The chat server group')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
