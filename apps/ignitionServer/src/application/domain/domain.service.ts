import { Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Domain } from './domain.mongo.entity';
import { ObjectId } from 'mongodb';

export class DomainService {
  constructor(
    @Inject('DOMAIN_REPOSITORY')
    private domainRepository: MongoRepository<Domain>,
  ) { }

  saveAndUpdate(domain) {
    const { id, ...res } = domain;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.domainRepository.save(domain);
  }

  updateOne(id, domain) {
    return this.domainRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...domain } },
      { upsert: false },
    );
  }

  findOne(id) {
    return this.domainRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  findALL() {
    return this.domainRepository.find();
  }
}
