import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { System } from './system.entity';

@Module({
  providers: [
    {
      provide: 'SYSTEM_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(System),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    ,
    SystemService,
  ],
  imports: [DatabaseModule],
  controllers: [SystemController],
})
export class SystemModule { }
