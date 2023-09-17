import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { System } from './system.mysql.entity';

@Injectable()
export class SystemService {
  constructor(
    @Inject('SYSTEM_REPOSITORY') private systemRepository: Repository<System>,
  ) {
  }
  create(system: System) {
    return this.systemRepository.save(system)
  }

  update(system: System) {
    return this.systemRepository.save(system)
  }

  async delete(id: number) {
    return await this.systemRepository.delete(id);
  }

  findById(id) {
    return this.systemRepository.findOne(id)
  }

  findByIds(ids: number[]) {
    return this.systemRepository.find({
      where: {
        id: In(ids)
      }
    })
  }

  list() {
    return this.systemRepository.find();
  }
}
