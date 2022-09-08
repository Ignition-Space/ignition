import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Page } from './page.mongo.entity';
import { ObjectId } from 'mongodb';
import { STATUS_TYPE } from '../site/site.mongo.entity';

@Injectable()
export class PageService {
  constructor(
    @Inject('PAGE_REPOSITORY')
    private pageRepository: MongoRepository<Page>,
  ) { }

  save(page) {
    return this.pageRepository.save(page);
  }

  findOne(id) {
    return this.pageRepository.findOne(id);
  }

  findOneByQuery(params) {
    return this.pageRepository.findOne({
      where: {
        ...params,
      },
    });
  }

  findAll(params = {}) {
    return this.pageRepository.find({
      where: {
        ...params,
        // status: {
        //   $ne: STATUS_TYPE.deleted,
        // },
      },
    });
  }

  updateOne(id, page: Partial<Page>) {
    return this.pageRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...page } },
      { upsert: true },
    );
  }
}
