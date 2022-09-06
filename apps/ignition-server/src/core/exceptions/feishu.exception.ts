/*
 * @Author: Cookie
 * @Description:
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class FeishuHttpException extends HttpException {
  constructor(err: any) {
    const { data = {}, status = HttpStatus.INTERNAL_SERVER_ERROR } =
      err.response || {};
    super(typeof data === 'string' ? data : JSON.stringify(data), status);
  }
}
