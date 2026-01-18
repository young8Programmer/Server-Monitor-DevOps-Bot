import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [BackupService, ConfigService],
  exports: [BackupService],
})
export class BackupModule {}