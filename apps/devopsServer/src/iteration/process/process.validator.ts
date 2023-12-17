import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { Process } from './process.entity';
import { ProcessService } from './process.service';

@ValidatorConstraint()
export class ProcessConstraint implements ValidatorConstraintInterface {
  constructor(private readonly processService: ProcessService) { }
  async validate(inputValue: any, { property }: ValidationArguments) {
    switch (property) {
      case 'processId':
        const process: Process = await this.processService.findProcess(
          inputValue,
        );
        if (!process) {
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

export function HasProcess(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'HasProcess',
      target: object.constructor,
      propertyName: 'processId',
      constraints: [],
      options: validationOptions,
      validator: ProcessConstraint,
    });
  };
}
