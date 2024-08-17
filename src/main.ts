import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthguard } from './auth/guards/jwt.guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new JwtAuthguard());
  await app.listen(3000);
}
bootstrap();
