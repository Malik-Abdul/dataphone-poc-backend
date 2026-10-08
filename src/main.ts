import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      skipMissingProperties: false, // also it false bydefault no need to set false it explicitly
    }),
  );

  // CORS configuration is appropriate for your Next.js frontend on port 3013:
  app.enableCors({
    origin: 'http://localhost:3001', // Your Next.js app
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// because I am using HttpOnly cookies, our Axios/fetch requests from Next.js should use credentials, e.g. Axios:

// axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true,
// });
