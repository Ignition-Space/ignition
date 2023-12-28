import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { VirtualMaterial } from './virtual.mongo.entity';

@Injectable()
export class VirtualMaterialService {
  constructor(
    @Inject('VIRTUAL_MATERIAL_REPOSITORY')
    private materialRepository: MongoRepository<VirtualMaterial>,
  ) { }

  save(material) {
    return this.materialRepository.save(material)
  }

  findOne(id) {
    return this.materialRepository.findOne(id)
  }

  getList(params) {
    return this.materialRepository.find(params)
  }

  updateOne(id, params) {
    return this.materialRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...params } },
      { upsert: true }
    )
  }
}
