import { Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Application } from './application.mongo.entity';
import { ObjectId } from 'mongodb';

export class ApplicationService {
  constructor(
    @Inject('APP_REPOSITORY')
    private applicationRepository: MongoRepository<Application>,
  ) { }

  saveAndUpdate(application) {
    const { id, ...res } = application;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.applicationRepository.save(application);
  }

  updateOne(id, application) {
    return this.applicationRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...application } },
      { upsert: false },
    );
  }

  async findOne(id) {
    const app = await this.applicationRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });

    return {
      ...app,
      domains: []
    }
  }

  findALL() {
    return this.applicationRepository.find();
  }
}
