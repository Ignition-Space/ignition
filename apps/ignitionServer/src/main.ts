import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter, HttpExceptionFilter } from '@app/common';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 设置全局接口前缀
  app.setGlobalPrefix('api');

  // 开启跨域
  app.enableCors({
    credentials: true,
    origin: ['*.ig-space.com', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // allowedHeaders: '*',
  });

  // 格式化 cookie
  app.use(cookieParser());

  // 接口版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app);

  await app.listen(4002);
}
bootstrap();
