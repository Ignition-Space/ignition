import { Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Site, STATUS_TYPE } from './site.mongo.entity';
import { ObjectId } from 'mongodb';

export class SiteService {
  constructor(
    @Inject('SITE_REPOSITORY')
    private siteRepository: MongoRepository<Site>,
  ) { }

  saveAndUpdate(site) {
    const { id, ...res } = site;
    if (id) {
      return this.updateOne(id, res);
    }
    return this.siteRepository.save(site);
  }

  updateOne(id, site) {
    return this.siteRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...site } },
      { upsert: false },
    );
  }

  findOne(id) {
    return this.siteRepository.findOne(id);
  }

  findALL() {
    return this.siteRepository.find({
      where: {
        status: STATUS_TYPE.inactive,
      },
    });
  }

}
