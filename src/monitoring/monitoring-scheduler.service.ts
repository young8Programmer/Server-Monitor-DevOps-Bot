import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonitoringService } from './monitoring.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MonitoringSchedulerService implements OnModuleInit {
  private readonly allowedChatIds: number[] = [];

  constructor(
    private monitoringService: MonitoringService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.allowedChatIds.push(...this.configService.getAllowedTelegramIds());
  }

  // Run every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async checkSystemHealth() {
    try {
      const threshold = this.configService.getRamThreshold();
      const ramCheck = await this.monitoringService.checkRamThreshold(threshold);

      if (ramCheck.exceeded) {
        const status = await this.monitoringService.getSystemStatus();
        const alertMessage = 
          `🚨 *RAM Threshold Oshib ketdi!*\n\n` +
          `💾 RAM Foydalanish: *${ramCheck.usage}%*\n` +
          `⚙️ Threshold: ${threshold}%\n\n` +
          `📊 Hozirgi holat:\n` +
          `CPU: ${status.cpu.usage}%\n` +
          `Disk: ${status.disk.used}%`;

        // Send alert to all allowed chat IDs
        for (const chatId of this.allowedChatIds) {
          try {
            // Note: In production, you'd need to store bot instance or use a different approach
            // This is a simplified version
          } catch (error) {
            console.error(`Failed to send alert to ${chatId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Monitoring check failed:', error);
    }
  }
}