import { Module } from '@nestjs/common';
import { IterationService } from './iteration.service';
import { Iteration } from './iteration.mongo.entity';
import { IterationController } from './iteration.controller';
import { PageModule } from '@ignitionServer/pages/page.module';
import { ApplicationModule } from '@ignitionServer/application/application.module';

@Module({
  imports: [PageModule, ApplicationModule],
  controllers: [IterationController],
  providers: [
    IterationService,
    {
      provide: 'ITERATION_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Iteration),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [IterationService],
})

export class IterationModule { }
