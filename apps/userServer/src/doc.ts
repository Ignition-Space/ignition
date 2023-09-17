/*
 * @Author: Cookie
 * @Description: 创建文档
 */

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as packageConfig from '../package.json'


export const generateDocument = (app) => {
  const options = new DocumentBuilder()
    .setTitle('火石用户系统 - 统一用户中心')
    .setDescription('宁愿累死自己，也要卷死他人 -> 致高凯')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/doc', app, document);
}
