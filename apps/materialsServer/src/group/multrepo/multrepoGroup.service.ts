import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository, In, ObjectId } from 'typeorm';
import { MultrepoGroup } from './multrepoGroup.mongo.entity';

@Injectable()
export class MultrepoGroupService {
  constructor(
    @Inject('MULTREPO_GROUP_REPOSITORY')
    private groupRepository: MongoRepository<MultrepoGroup>,
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
