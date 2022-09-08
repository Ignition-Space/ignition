import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { MaterialConfig } from './materialConfig.mongo.entity';

@Injectable()
export class MaterialConfigService {
  constructor(
    @Inject('MATERIAL_CONFIG_REPOSITORY')
    private materialConfigServer: MongoRepository<MaterialConfig>,
  ) { }

  save(materialConfig) {
    return this.materialConfigServer.save(materialConfig);
  }

  getList(params) {
    return this.materialConfigServer.find(params);
  }

  findOne(id) {
    return this.materialConfigServer.findOne(id);
  }
}
