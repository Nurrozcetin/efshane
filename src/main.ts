import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:5173',  
    methods: 'GET,POST,PUT,DELETE',  
    credentials: true,  
    exposedHeaders: ['Content-Disposition'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
    setHeaders: (res) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);  
}
bootstrap();
