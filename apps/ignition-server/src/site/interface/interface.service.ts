import { Inject } from '@nestjs/common';
import { MongoRepository, ObjectID } from 'typeorm';
import { Interface } from './interface.mongo.entity';

export class InterfaceService {
  constructor(
    @Inject('INTERFACE_REPOSITORY')
    private interfaceRepository: MongoRepository<Interface>,
  ) { }

  saveAndUpdate(site) {
    if (site.id) {
      const { id, ...res } = site;
      return this.updateOne(id, res);
    }
    return this.interfaceRepository.save(site);
  }

  updateOne(id, site) {
    return this.interfaceRepository.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { ...site } },
      { upsert: true },
    );
  }

  findOne(id) {
    return this.interfaceRepository.findOne(id);
  }

  findBySite(siteId) {
    return this.interfaceRepository.find({
      where: {
        siteId,
      },
    });
  }
}
