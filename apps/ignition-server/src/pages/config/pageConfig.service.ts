import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { PageConfig } from './pageConfig.mongo.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PageConfigService {
  constructor(
    @Inject('PAGE_CONFIG_REPOSITORY')
    private pageConfigRepository: MongoRepository<PageConfig>,
  ) { }

  save(page) {
    return this.pageConfigRepository.save(page);
  }

  findOne(id) {
    return this.pageConfigRepository.findOne(id);
  }

  findAll(params: Partial<PageConfig>) {
    return this.pageConfigRepository.find({
      where: { ...params },
    });
  }

  updateOne(id, pageConfig) {
    return this.pageConfigRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...pageConfig } },
      { upsert: true },
    );
  }
}
