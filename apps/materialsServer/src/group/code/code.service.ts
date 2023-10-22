import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { CodeGroup } from './code.mongo.entity';

@Injectable()
export class CodeGroupService {
  constructor(
    @Inject('CODE_GROUP_REPOSITORY')
    private groupRepository: MongoRepository<CodeGroup>,
  ) { }

  save(group) {
    return this.groupRepository.save(group);
  }

  getList(params) {
    return this.groupRepository.find(params);
  }

  getListByParams(params) {
    return this.groupRepository.find({ where: { ...params } });
  }

  getListByIds(ids) {
    return this.groupRepository.find({
      where: {
        _id: {
          $in: ids.map((id) => new ObjectId(id)),
        },
      },
    });
  }

  del(id) {
    this.groupRepository.delete(new ObjectId(id));
  }
}
