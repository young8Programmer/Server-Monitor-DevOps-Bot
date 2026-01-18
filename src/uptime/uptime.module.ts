import { Module } from '@nestjs/common';
import { UptimeService } from './uptime.service';
import { UptimeSchedulerService } from './uptime-scheduler.service';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [UptimeService, UptimeSchedulerService, ConfigService],
  exports: [UptimeService],
})
export class UptimeModule {}