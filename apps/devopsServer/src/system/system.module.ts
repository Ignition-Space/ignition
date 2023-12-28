import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemProviders } from './system.providers';

@Module({
  providers: [...SystemProviders, SystemService],
  imports: [DatabaseModule],
  controllers: [SystemController],
})
export class SystemModule { }
