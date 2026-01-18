import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { TelegramBotModule } from './telegram/telegram-bot.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { TerminalModule } from './terminal/terminal.module';
import { LogTrackerModule } from './log-tracker/log-tracker.module';
import { UptimeModule } from './uptime/uptime.module';
import { BackupModule } from './backup/backup.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        token: configService.getTelegramToken(),
      }),
      inject: [ConfigService],
    }),
    TelegramBotModule,
    MonitoringModule,
    TerminalModule,
    LogTrackerModule,
    UptimeModule,
    BackupModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}