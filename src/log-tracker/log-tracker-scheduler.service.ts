import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogTrackerService } from './log-tracker.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class LogTrackerSchedulerService implements OnModuleInit {
  constructor(
    private logTrackerService: LogTrackerService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const logPaths = this.configService.getLogPaths();
    console.log(`📝 Log Tracker initialized with ${logPaths.length} log files`);
  }

  // Check logs every 30 seconds
  @Cron('*/30 * * * * *')
  async checkLogs() {
    try {
      const logPaths = this.configService.getLogPaths();

      for (const logPath of logPaths) {
        try {
          const errors = await this.logTrackerService.trackLogFile(logPath);

          if (errors.length > 0) {
            const errorMessage = 
              `🚨 *Yangi Xatolar Topildi*\n\n` +
              `📁 Fayl: \`${logPath}\`\n\n` +
              `❌ Xatolar:\n\`\`\`\n${errors.slice(-5).join('\n')}\n\`\`\``;

            // In production, send via Telegram service
            console.log('ERROR DETECTED:', errorMessage);
          }
        } catch (error: any) {
          console.error(`Failed to track log file ${logPath}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Log tracker error:', error);
    }
  }
}