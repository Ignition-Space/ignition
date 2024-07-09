import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Page } from './page.mongo.entity';
import { ObjectId } from 'mongodb';
import { PageVersion } from './pageVersion.mongo.entity copy';

@Injectable()
export class PageService {
  constructor(
    @Inject('PAGE_REPOSITORY')
    private pageRepository: MongoRepository<Page>,
    @Inject('PAGE_VERSION_REPOSITORY')
    private pageVersionRepository: MongoRepository<PageVersion>,
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

  async saveAndUpdatePageVersion(pageVersions) {
    return this.pageVersionRepository.save(pageVersions);
  }

  async findPageVersionOne({ page, env }) {
    const queryBuilder =
      this.pageVersionRepository.createQueryBuilder('PageVersion');

    queryBuilder.where(`PageVersion.page_id = "${page.id}"`);

    queryBuilder.andWhere(`PageVersion.env = "${env}"`);

    const pageVersion = await queryBuilder.getOne();

    return pageVersion;
  }
}
