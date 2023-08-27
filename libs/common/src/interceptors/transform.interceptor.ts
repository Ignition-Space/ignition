import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { IS_STREAM_KEY } from '../constants';
interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly reflector: Reflector) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {

    const IS_STREAM = this.reflector.getAllAndOverride<boolean>(IS_STREAM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (IS_STREAM) return next.handle().pipe()
    return next.handle().pipe(
      map((data) => ({
        data,
        status: 0,
        extra: {},
        message: 'success',
        success: true,
      })),
    );
  }
}
