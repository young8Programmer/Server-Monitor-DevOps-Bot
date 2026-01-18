import { Module } from '@nestjs/common';
import { LogTrackerService } from './log-tracker.service';
import { LogTrackerSchedulerService } from './log-tracker-scheduler.service';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [LogTrackerService, LogTrackerSchedulerService, ConfigService],
  exports: [LogTrackerService],
})
export class LogTrackerModule {}