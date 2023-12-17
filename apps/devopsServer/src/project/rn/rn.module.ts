import { Module } from '@nestjs/common';
import { RnService } from './rn.service';
import { RnController } from './rn.controller';
import { rnProviders } from './rn.providers';
import { DatabaseModule } from '@app/common';

@Module({
  providers: [...rnProviders, RnService],
  imports: [DatabaseModule],
  controllers: [RnController],
})
export class RnModule { }
