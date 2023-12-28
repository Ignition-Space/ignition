import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { System } from './system.entity';

@Injectable()
export class SystemService {
  constructor(
    @Inject('SYSTEM_REPOSITORY')
    private readonly SystemRepository: Repository<System>,
  ) { }

  createOrUpdate(System) {
    return this.SystemRepository.save(System);
  }

  findById(id) {
    return this.SystemRepository.findOne(id);
  }

  findByIds(ids) {
    return this.SystemRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findByAll() {
    return this.SystemRepository.find();
  }
}
