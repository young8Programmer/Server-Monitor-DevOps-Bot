import { Module, forwardRef } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotUpdate } from './telegram-bot.update';
import { ConfigService } from '../config/config.service';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { TerminalModule } from '../terminal/terminal.module';
import { BackupModule } from '../backup/backup.module';
import { TelegramSecurityGuard } from './guards/telegram-security.guard';

@Module({
  imports: [
    TelegrafModule,
    MonitoringModule,
    TerminalModule,
    BackupModule,
  ],
  providers: [
    TelegramBotService,
    TelegramBotUpdate,
    TelegramSecurityGuard,
    ConfigService,
  ],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}