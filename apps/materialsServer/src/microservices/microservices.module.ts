import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getConfig } from '@app/common';
import { UserService } from './user.service';
const { USER_MICROSERVICES } = getConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER-SERVER',
        transport: Transport.TCP,
        options: USER_MICROSERVICES,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class MicroservicesModule { }
