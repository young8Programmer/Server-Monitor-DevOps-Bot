import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '../config/config.service';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  constructor(private configService: ConfigService) {}

  async createBackup(): Promise<string> {
    const dbConfig = this.configService.getDatabaseConfig();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    let backupCommand: string;
    let backupFileName: string;

    switch (dbConfig.type.toLowerCase()) {
      case 'postgres':
      case 'postgresql':
        backupFileName = `backup-postgres-${timestamp}.sql.gz`;
        const pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
        backupCommand = `"${pgDumpPath}" -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} | gzip > "${path.join(backupDir, backupFileName)}"`;
        // Set password via environment variable
        process.env.PGPASSWORD = dbConfig.password;
        break;

      case 'mysql':
      case 'mariadb':
        backupFileName = `backup-mysql-${timestamp}.sql.gz`;
        const mysqldumpPath = process.env.MYSQLDUMP_PATH || 'mysqldump';
        backupCommand = `"${mysqldumpPath}" -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} | gzip > "${path.join(backupDir, backupFileName)}"`;
        break;

      case 'mongodb':
        backupFileName = `backup-mongodb-${timestamp}.tar.gz`;
        const mongodumpPath = process.env.MONGODUMP_PATH || 'mongodump';
        const mongoBackupDir = path.join(backupDir, `mongodb-${timestamp}`);
        backupCommand = `"${mongodumpPath}" --host ${dbConfig.host}:${dbConfig.port} --username ${dbConfig.user} --password ${dbConfig.password} --db ${dbConfig.database} --out "${mongoBackupDir}" && tar -czf "${path.join(backupDir, backupFileName)}" -C "${backupDir}" "mongodb-${timestamp}" && rm -rf "${mongoBackupDir}"`;
        break;

      default:
        throw new Error(`Unsupported database type: ${dbConfig.type}`);
    }

    try {
      await execAsync(backupCommand, {
        timeout: 600000, // 10 minutes timeout
        maxBuffer: 1024 * 1024 * 50, // 50MB buffer
      });

      const backupPath = path.join(backupDir, backupFileName);

      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file was not created');
      }

      // Clean up old backups (keep last 10)
      this.cleanupOldBackups(backupDir, backupFileName);

      return backupPath;
    } catch (error: any) {
      throw new Error(`Backup failed: ${error.message}`);
    } finally {
      // Clean up password from environment
      if (dbConfig.type.toLowerCase() === 'postgres' || dbConfig.type.toLowerCase() === 'postgresql') {
        delete process.env.PGPASSWORD;
      }
    }
  }

  private cleanupOldBackups(backupDir: string, currentBackup: string): void {
    try {
      const files = fs.readdirSync(backupDir)
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          time: fs.statSync(path.join(backupDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // Keep only last 10 backups
      const backupsToKeep = 10;
      const filesToDelete = files.slice(backupsToKeep);

      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }
}