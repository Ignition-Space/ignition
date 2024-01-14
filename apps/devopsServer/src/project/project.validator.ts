import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { ProjectService } from '@devopsServer/project/project.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProjectConstraint implements ValidatorConstraintInterface {
  constructor(private readonly projectService: ProjectService) { }

  async validate(inputValue: any, { property, ...rest }: ValidationArguments) {
    switch (property) {
      case 'projectId':
        const project = await this.projectService.findProjectById(inputValue);

        if (!project) {
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

export function HasProject(validationOptions?: ValidationOptions) {
  return function (object: any) {
    registerDecorator({
      name: 'hasProject',
      target: object.constructor,
      propertyName: 'projectId',
      constraints: [{ message: '项目不存在' }],
      options: validationOptions,
      validator: ProjectConstraint,
    });
  };
}
