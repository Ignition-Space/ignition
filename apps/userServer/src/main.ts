declare const module: any;

import { NestFactory } from '@nestjs/core';
import { UserCenterModule } from './user-center.module';

import { generateDocument } from './doc';
import { AllExceptionsFilter, HttpExceptionFilter } from '@app/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(UserCenterModule);

  // 开启跨域
  app.enableCors({
    credentials: true,
    origin: [
      '*.ig-space.com',
      'http://127.0.0.1:10010',
      'http://localhost:10010',
      'http://localhost:5000',
    ],
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: '*',
  });

  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 设置全局接口前缀
  app.setGlobalPrefix('api');

  // 接口版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app);

  // 格式化 cookie
  app.use(cookieParser());

  // 启动所有微服务
  await app.startAllMicroservices();

  // 启动服务
  await app.listen(4000);
}

bootstrap();
