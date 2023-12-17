import { HttpException, HttpStatus } from '@nestjs/common';

export class GitlabHttpException extends HttpException {
  constructor(err: any) {
    const { data = {}, status = HttpStatus.INTERNAL_SERVER_ERROR } =
      err.response || {};
    // const { message = 'INTERNAL_SERVER_ERROR' } = data;

    // 默认使用 gitlab 的http 类型异常状态和消息。
    super(typeof data === 'string' ? data : JSON.stringify(data), status);

    // 如果要处理成 http 200 ok 的正常返回，使用下面的代码。

    // super(
    //   message,
    //   status !== HttpStatus.INTERNAL_SERVER_ERROR
    //     ? HttpStatus.OK
    //     : HttpStatus.INTERNAL_SERVER_ERROR,
    // );
  }
}
