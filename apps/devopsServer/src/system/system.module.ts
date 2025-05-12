import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { System } from './system.mongo.entity';

@Module({
  providers: [
    {
      provide: 'SYSTEM_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(System),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    SystemService,
  ],
  imports: [DatabaseModule],
  controllers: [SystemController],
})
export class SystemModule { }
