import { Injectable, UseGuards } from '@nestjs/common';
import { Update, Ctx, Start, Command, On, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramSecurityGuard } from './guards/telegram-security.guard';
import { MonitoringService } from '../monitoring/monitoring.service';
import { TerminalService } from '../terminal/terminal.service';
import { BackupService } from '../backup/backup.service';
import { ConfigService } from '../config/config.service';

@Update()
@Injectable()
export class TelegramBotUpdate {
  constructor(
    private monitoringService: MonitoringService,
    private terminalService: TerminalService,
    private backupService: BackupService,
    private configService: ConfigService,
  ) {}

  @Start()
  @UseGuards(TelegramSecurityGuard)
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      '🛡️ *OpsPulse AI Bot*\n\n' +
      'Men serveringizni monitoring qilaman va masofadan boshqarish imkonini beraman.\n\n' +
      '📋 *Mavjud buyruqlar:*\n' +
      '/status - Server holatini ko\'rish\n' +
      '/stats - Batafsil statistika\n' +
      '/terminal - Terminal buyruqlarini bajarish\n' +
      '/backup - Database backup yaratish\n' +
      '/help - Yordam',
      { parse_mode: 'Markdown' }
    );
  }

  @Command('status')
  @UseGuards(TelegramSecurityGuard)
  async getStatus(@Ctx() ctx: Context) {
    try {
      const status = await this.monitoringService.getSystemStatus();
      const message = 
        '📊 *Server Holati*\n\n' +
        `🖥 CPU: ${status.cpu.usage}%\n` +
        `💾 RAM: ${status.mem.used}% (${status.mem.usedGB}GB / ${status.mem.totalGB}GB)\n` +
        `💿 Disk: ${status.disk.used}% (${status.disk.usedGB}GB / ${status.disk.totalGB}GB)\n` +
        `⏱ Uptime: ${status.uptime}\n` +
        `🌡 Load Average: ${status.loadAverage.join(', ')}`;
      
      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Xatolik: ${error.message}`);
    }
  }

  @Command('stats')
  @UseGuards(TelegramSecurityGuard)
  async getStats(@Ctx() ctx: Context) {
    try {
      const stats = await this.monitoringService.getDetailedStats();
      const message = 
        '📈 *Batafsil Statistika*\n\n' +
        `🖥 *CPU:*\n` +
        `   Foydalanish: ${stats.cpu.usage}%\n` +
        `   Cores: ${stats.cpu.cores}\n` +
        `   Model: ${stats.cpu.model}\n\n` +
        `💾 *RAM:*\n` +
        `   Foydalanish: ${stats.mem.used}% (${stats.mem.usedGB}GB / ${stats.mem.totalGB}GB)\n` +
        `   Available: ${stats.mem.availableGB}GB\n\n` +
        `💿 *Disk:*\n` +
        `   Foydalanish: ${stats.disk.used}% (${stats.disk.usedGB}GB / ${stats.disk.totalGB}GB)\n` +
        `   Free: ${stats.disk.freeGB}GB`;
      
      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Xatolik: ${error.message}`);
    }
  }

  @Command('terminal')
  @UseGuards(TelegramSecurityGuard)
  async terminalCommand(@Ctx() ctx: Context) {
    await ctx.reply(
      '💻 *Terminal Buyruqlari*\n\n' +
      'Terminal buyruqini yuboring.\n' +
      'Masalan: `df -h` yoki `docker ps`\n\n' +
      '⚠️ *Eslatma:* Faqat xavfsiz buyruqlarni bajarish tavsiya etiladi.',
      { parse_mode: 'Markdown' }
    );
  }

  @Hears(/^(?!\/)/)
  @UseGuards(TelegramSecurityGuard)
  async handleTerminalCommand(@Ctx() ctx: Context) {
    const command = (ctx.message as any).text;

    // Check if it's a terminal command (not a bot command)
    if (command.startsWith('/')) {
      return;
    }

    // Prevent dangerous commands
    const dangerousCommands = ['rm -rf', 'format', 'mkfs', 'dd if='];
    const isDangerous = dangerousCommands.some(cmd => command.toLowerCase().includes(cmd.toLowerCase()));

    if (isDangerous) {
      await ctx.reply('⚠️ Bu buyruq xavfsizlik sababidan bloklandi!');
      return;
    }

    try {
      await ctx.reply('⏳ Buyruq bajarilmoqda...');
      const result = await this.terminalService.executeCommand(command);
      
      if (result.length > 4000) {
        // Split long messages
        const chunks = result.match(/[\s\S]{1,4000}/g) || [];
        for (const chunk of chunks) {
          await ctx.reply(`\`\`\`\n${chunk}\n\`\`\``, { parse_mode: 'Markdown' });
        }
      } else {
        await ctx.reply(`\`\`\`\n${result}\n\`\`\``, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      await ctx.reply(`❌ Xatolik: ${error.message}`);
    }
  }

  @Command('backup')
  @UseGuards(TelegramSecurityGuard)
  async createBackup(@Ctx() ctx: Context) {
    try {
      await ctx.reply('💾 Database backup yaratilmoqda...');
      const backupPath = await this.backupService.createBackup();
      
      await ctx.replyWithDocument(
        { source: backupPath },
        {
          caption: '✅ Database backup muvaffaqiyatli yaratildi!',
        }
      );
    } catch (error) {
      await ctx.reply(`❌ Backup xatoligi: ${error.message}`);
    }
  }

  @Command('help')
  @UseGuards(TelegramSecurityGuard)
  async help(@Ctx() ctx: Context) {
    await ctx.reply(
      '📖 *OpsPulse AI - Yordam*\n\n' +
      '*Buyruqlar:*\n' +
      '/start - Botni ishga tushirish\n' +
      '/status - Server holatini ko\'rish\n' +
      '/stats - Batafsil statistika\n' +
      '/terminal - Terminal buyruqlari\n' +
      '/backup - Database backup\n' +
      '/help - Ushbu yordam\n\n' +
      'Bot avtomatik ravishda server holatini monitoring qiladi va ogohlantirishlar yuboradi.',
      { parse_mode: 'Markdown' }
    );
  }

  // Method to send alerts (used by other services)
  async sendAlert(message: string, chatId: number, ctx?: Context) {
    const targetCtx = ctx || this.getDefaultContext();
    if (targetCtx) {
      await targetCtx.reply(`🚨 *Alert*\n\n${message}`, { parse_mode: 'Markdown' });
    }
  }

  private getDefaultContext(): Context | null {
    // This would need to be implemented with context storage
    // For now, alerts will be sent through the monitoring service
    return null;
  }
}