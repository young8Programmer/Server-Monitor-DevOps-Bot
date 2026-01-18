import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { TerminalService } from '../terminal/terminal.service';
import { BackupService } from '../backup/backup.service';

@Injectable()
export class TelegramBotService {
  constructor(
    private configService: ConfigService,
    private monitoringService: MonitoringService,
    private terminalService: TerminalService,
    private backupService: BackupService,
  ) {}

  async sendAlert(message: string, chatId?: number): Promise<void> {
    // This will be used by other services to send alerts
    // Implementation handled by TelegramBotUpdate
  }

  getMonitoringService(): MonitoringService {
    return this.monitoringService;
  }

  getTerminalService(): TerminalService {
    return this.terminalService;
  }

  getBackupService(): BackupService {
    return this.backupService;
  }
}