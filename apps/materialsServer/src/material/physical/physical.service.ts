import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { PhysicalMaterial } from './physical.mongo.entity';

@Injectable()
export class PhysicalMaterialService {
  constructor(
    @Inject('PHYSICAL_MATERIAL_REPOSITORY')
    private PhysicalMaterialRepository: MongoRepository<PhysicalMaterial>,
  ) { }

  save(PhysicalMaterial) {
    return this.PhysicalMaterialRepository.save(PhysicalMaterial)
  }

  findOne(id) {
    return this.PhysicalMaterialRepository.findOne(id)
  }

  findOneByProjectId(projectId) {
    return this.PhysicalMaterialRepository.findOne({
      where: {
        projectId
      }
    })
  }

  getList(params) {
    return this.PhysicalMaterialRepository.find(params)
  }

  updateOne(id, params) {
    return this.PhysicalMaterialRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...params } },
      { upsert: true }
    )
  }

}
