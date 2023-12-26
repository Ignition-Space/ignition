import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { ProjectType } from './project-type.entity';
import { ProjectTypeService } from './project-type.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProjectTypeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly projectTypeService: ProjectTypeService) { }

  async validate(inputValue: any, { property }: ValidationArguments) {
    switch (property) {
      case 'projectType':
        const projectType: ProjectType =
          await this.projectTypeService.findProjectTypeByType(inputValue);

        if (!projectType) {
          return false;
        }
        break;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    console.log(args);
    const { property, value } = args;
    return `${property} : ${value} ，验证失败`;
  }
}
