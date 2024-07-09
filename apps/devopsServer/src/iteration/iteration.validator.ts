import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { Iteration } from './iteration.entity';
import { IterationService } from './iteration.service';
import * as semver from 'semver';

@ValidatorConstraint()
export class IterationConstraint implements ValidatorConstraintInterface {
  constructor(private readonly iterationService: IterationService) { }
  async validate(inputValue: any, { property }: ValidationArguments) {
    switch (property) {
      case 'iterationId':
        const iteration: Iteration =
          await this.iterationService.findIterationById(inputValue);
        console.log('iteration', iteration);
        if (!iteration) {
          return false;
        }
        break;
      case 'version':
        // 输入不合法，拒绝
        if (!semver.valid(inputValue)) {
          return false;
        }
        break;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { property, value } = args;
    // here you can provide default error message if validation failed
    return `${property} : ${value} ，验证失败`;
  }
}

export function IsValidVersion(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidVersion',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IterationConstraint,
    });
  };
}

export function HasIteration(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'HasIteration',
      target: object.constructor,
      propertyName: 'iterationId',
      constraints: [],
      options: validationOptions,
      validator: IterationConstraint,
    });
  };
}
