import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { Context } from 'telegraf';

@Injectable()
export class TelegramSecurityGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.getArgByIndex(0) as Context;
    const userId = ctx.from?.id;

    if (!userId) {
      return false;
    }

    const allowedIds = this.configService.getAllowedTelegramIds();

    if (allowedIds.length === 0) {
      // If no IDs configured, allow all (for development)
      return true;
    }

    return allowedIds.includes(userId);
  }
}