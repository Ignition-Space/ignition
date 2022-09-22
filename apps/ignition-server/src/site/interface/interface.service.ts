import { Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Interface } from './interface.mongo.entity';
import { ObjectId } from 'mongodb';
import path from 'path';

export class InterfaceService {
  constructor(
    @Inject('INTERFACE_REPOSITORY')
    private interfaceRepository: MongoRepository<Interface>,
  ) { }

  saveAndUpdate(inter) {
    const { id, ...res } = inter;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.interfaceRepository.save(res);
  }

  saveAndUpdateByPath(inter) {
    const { id, ...res } = inter;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.interfaceRepository.save(res);
  }

  insertMany(list) {
    return this.interfaceRepository.insertMany(list);
  }

  updateOne(id, inter) {
    return this.interfaceRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...inter } },
      { upsert: true },
    );
  }

  findOne(id) {
    return this.interfaceRepository.findOne(id);
  }

  findByUrl(siteId, url) {
    return this.interfaceRepository.findOne({
      where: {
        siteId,
        url,
      },
    });
  }

  findBySite(siteId) {
    return this.interfaceRepository.find({
      where: {
        siteId,
      },
    });
  }
}
