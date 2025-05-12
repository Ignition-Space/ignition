import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { System } from './system.mongo.entity';

@Injectable()
export class SystemService {
  constructor(
    @Inject('SYSTEM_REPOSITORY')
    private readonly SystemRepository: MongoRepository<System>,
  ) { }

  createOrUpdate(System) {
    return this.SystemRepository.save(System);
  }

  findById(id) {
    return this.SystemRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  findByIds(ids) {
    return this.SystemRepository.find({
      where: {
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      },
    });
  }

  findByAll() {
    return this.SystemRepository.find();
  }
}
