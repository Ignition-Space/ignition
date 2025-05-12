import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { System } from './system.mongo.entity';

@Injectable()
export class SystemService {
  constructor(
    @Inject('SYSTEM_REPOSITORY')
    private systemRepository: MongoRepository<System>,
  ) { }

  save(system: System) {
    return this.systemRepository.save(system);
  }

  findById(id) {
    return this.systemRepository.findOne(id);
  }

  findByIds(ids: string[]) {
    return this.systemRepository.find({
      where: {
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      },
    });
  }

  getList() {
    return this.systemRepository.find();
  }
}
