import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class TerminalService {
  async executeCommand(command: string): Promise<string> {
    // Security: Limit command execution time
    const timeout = 30000; // 30 seconds

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });

      if (stderr) {
        return `STDERR:\n${stderr}\n\nSTDOUT:\n${stdout}`;
      }

      return stdout || '(No output)';
    } catch (error: any) {
      if (error.killed && error.signal === 'SIGTERM') {
        throw new Error('Command execution timeout');
      }
      throw new Error(error.message || 'Command execution failed');
    }
  }
}