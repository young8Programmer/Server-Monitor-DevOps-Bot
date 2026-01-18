import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UptimeService } from './uptime.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UptimeSchedulerService implements OnModuleInit {
  private lastStatus: Map<string, string> = new Map();

  constructor(
    private uptimeService: UptimeService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const urls = this.configService.getUptimeUrls();
    console.log(`🌐 Uptime Checker initialized with ${urls.length} URLs`);
  }

  // Check every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkUptime() {
    try {
      const urls = this.configService.getUptimeUrls();

      for (const url of urls) {
        try {
          const result = await this.uptimeService.checkUrl(url);
          const lastStatus = this.lastStatus.get(url) || 'unknown';

          // Alert on status change to offline or error
          if ((result.status === 'offline' || result.status === 'error') && lastStatus === 'online') {
            const alertMessage = 
              `🚨 *Sayt Ishlamayapti!*\n\n` +
              `🌐 URL: ${url}\n` +
              `❌ Status: ${result.status}\n` +
              `📊 Status Code: ${result.statusCode || 'N/A'}\n` +
              `⏱ Response Time: ${result.responseTime}ms\n` +
              `💬 Xabar: ${result.message || 'N/A'}`;

            console.log('UPTIME ALERT:', alertMessage);
          }

          // Alert on recovery
          if (result.status === 'online' && (lastStatus === 'offline' || lastStatus === 'error')) {
            const recoveryMessage = 
              `✅ *Sayt Tiklandi!*\n\n` +
              `🌐 URL: ${url}\n` +
              `📊 Status Code: ${result.statusCode}\n` +
              `⏱ Response Time: ${result.responseTime}ms`;

            console.log('UPTIME RECOVERY:', recoveryMessage);
          }

          this.lastStatus.set(url, result.status);
        } catch (error: any) {
          console.error(`Failed to check URL ${url}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Uptime checker error:', error);
    }
  }
}