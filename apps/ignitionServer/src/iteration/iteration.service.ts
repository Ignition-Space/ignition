import { Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Iteration } from './iteration.mongo.entity';
import { ObjectId } from 'mongodb';

export class IterationService {
  constructor(
    @Inject('ITERATION_REPOSITORY')
    private iterationRepository: MongoRepository<Iteration>,
  ) { }

  saveAndUpdate(application) {
    const { id, ...res } = application;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.iterationRepository.save(application);
  }

  updateOne(id, application) {
    return this.iterationRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...application } },
      { upsert: false },
    );
  }

  findOne(id) {
    return this.iterationRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  findALL() {
    return this.iterationRepository.find();
  }

  findLatest(pageId) {
    return this.iterationRepository.findOne({
      where: {
        pageId,
      },
      order: { createdAt: 'DESC' },
    });
  }

}
