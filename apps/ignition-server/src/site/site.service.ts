import { Inject } from '@nestjs/common';
import { MongoRepository, ObjectID } from 'typeorm';
import { Site } from './site.mongo.entity';

export class SiteService {
  constructor(
    @Inject('SITE_REPOSITORY')
    private siteRepository: MongoRepository<Site>,
  ) { }

  saveAndUpdate(site) {
    if (site.id) {
      const { id, ...res } = site;
      return this.updateOne(id, res);
    }
    return this.siteRepository.save(site);
  }

  updateOne(id, site) {
    return this.siteRepository.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { ...site } },
      { upsert: true },
    );
  }

  findOne(id) {
    return this.siteRepository.findOne(id);
  }
}
