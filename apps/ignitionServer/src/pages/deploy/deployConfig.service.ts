import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { DeployConfig } from './deployConfig.mongo.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class DeployConfigService {
  constructor(
    @Inject('DEPLOY_CONFIG_REPOSITORY')
    private deployConfigRepository: MongoRepository<DeployConfig>,
  ) { }

  save(page) {
    return this.deployConfigRepository.save(page);
  }

  findOne(id) {
    return this.deployConfigRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  find(params) {
    return this.deployConfigRepository.findOne({
      where: { ...params },
    });
  }

  findAll(params) {
    return this.deployConfigRepository.find({
      where: { ...params },
    });
  }

  updateOne(id, DeployConfig) {
    return this.deployConfigRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...DeployConfig } },
      { upsert: true },
    );
  }
}
