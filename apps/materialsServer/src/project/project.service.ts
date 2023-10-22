import { Injectable, Inject } from '@nestjs/common';
import { ObjectId, MongoRepository } from 'typeorm';
import { Project } from './project.mongo.entity';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: MongoRepository<Project>,
  ) { }

  saveAndUpdate(project) {
    const { id, ...params } = project
    if (id) {
      return this.projectRepository.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...params } },
        { upsert: true }
      )
    }
    return this.projectRepository.save(project)
  }

  findOne(id) {
    return this.projectRepository.findOne(id);
  }

  findAll() {
    return this.projectRepository.find();
  }
}
