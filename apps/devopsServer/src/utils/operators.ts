import { isEmpty, isNotEmpty } from 'class-validator';
import { Between, LessThanOrEqual, MoreThanOrEqual, Raw } from 'typeorm';

export const getOperatorByTime = (startTime: number, endTime: number) => {
  if (isEmpty(startTime) && isNotEmpty(endTime)) {
    // 取 结束时间 之前的所有数据
    return LessThanOrEqual(new Date(endTime));
  } else if (isEmpty(startTime) && isEmpty(endTime)) {
    return Raw(() => '1=1'); // 任意时间的数据
  } else if (isNotEmpty(startTime) && isNotEmpty(endTime)) {
    return Between(
      new Date(startTime).toISOString(),
      new Date(endTime).toISOString(),
    ); //取 两个时间之间的数据
  } else {
    // 取 起始时间 之后的所有数据
    return MoreThanOrEqual(new Date(startTime).toISOString());
  }
};
