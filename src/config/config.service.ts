import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getTelegramToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  }

  getAllowedTelegramIds(): number[] {
    const ids = process.env.ALLOWED_TELEGRAM_IDS || '';
    return ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }

  getMonitoringInterval(): number {
    return parseInt(process.env.MONITORING_INTERVAL || '60000'); // Default 1 minute
  }

  getRamThreshold(): number {
    return parseFloat(process.env.RAM_THRESHOLD || '90'); // Default 90%
  }

  getLogPaths(): string[] {
    const paths = process.env.LOG_PATHS || '';
    return paths.split(',').map(p => p.trim()).filter(p => p.length > 0);
  }

  getUptimeUrls(): string[] {
    const urls = process.env.UPTIME_URLS || '';
    return urls.split(',').map(u => u.trim()).filter(u => u.length > 0);
  }

  getDatabaseConfig(): { type: string; host: string; port: number; user: string; password: string; database: string } {
    return {
      type: process.env.DB_TYPE || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
    };
  }
}