import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  TransformInterceptor,
} from './core';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 设置全局接口前缀
  app.setGlobalPrefix('api');

  // 统一响应体格式
  // app.useGlobalInterceptors(new TransformInterceptor());

  // 开启跨域
  app.enableCors({
    credentials: true,
    origin: ['*.ig-space.com'],
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

  await app.listen(3000);
}
bootstrap();
