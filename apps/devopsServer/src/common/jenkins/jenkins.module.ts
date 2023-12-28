import { Module } from '@nestjs/common';
import { JenkinsController } from './jenkins.controller';
import { JenkinsService } from './jenkins.service';

@Module({
  imports: [],
  controllers: [JenkinsController],
  providers: [JenkinsService],
  exports: [JenkinsService],
})
export class JenkinsModule { }
