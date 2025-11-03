import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GatekeeperGuard } from './gatekeeper.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GatekeeperGuard,
    },
  ],
})
export class AuthModule {}

