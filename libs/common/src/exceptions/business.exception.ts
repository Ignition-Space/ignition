/*
 * @Author: Cookie
 * @Description: 
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { BUSINESS_ERROR_CODE } from './business.error.codes';

type BusinessError = {
  code: number;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: BUSINESS_ERROR_CODE.COMMON,
        message: err,
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwForbidden() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
      message: '抱歉哦，您无此权限！',
    });
  }

  static throwPermissionDisabled() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.PERMISSION_DISABLED,
      message: '权限已禁用',
    });
  }

  static throwUserDisabled() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.USER_DISABLED,
      message: '用户已冻结',
    });
  }
}
