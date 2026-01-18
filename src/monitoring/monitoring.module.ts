import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringSchedulerService } from './monitoring-scheduler.service';
import { ConfigService } from '../config/config.service';
import { TelegramBotModule } from '../telegram/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  providers: [MonitoringService, MonitoringSchedulerService, ConfigService],
  exports: [MonitoringService],
})
export class MonitoringModule {}