import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogTrackerService {
  private filePositions: Map<string, number> = new Map();

  async trackLogFile(filePath: string): Promise<string[]> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Log file not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const currentSize = stats.size;
    const lastPosition = this.filePositions.get(filePath) || 0;

    if (currentSize <= lastPosition) {
      return [];
    }

    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(currentSize - lastPosition);
    fs.readSync(fd, buffer, 0, buffer.length, lastPosition);
    fs.closeSync(fd);

    this.filePositions.set(filePath, currentSize);

    const newContent = buffer.toString('utf-8');
    const lines = newContent.split('\n').filter(line => line.trim().length > 0);

    // Filter for error lines
    const errorLines = lines.filter(line => 
      line.toLowerCase().includes('error') ||
      line.toLowerCase().includes('exception') ||
      line.toLowerCase().includes('fatal') ||
      line.toLowerCase().includes('critical')
    );

    return errorLines;
  }

  resetFilePosition(filePath: string): void {
    this.filePositions.delete(filePath);
  }

  getAllTrackedFiles(): string[] {
    return Array.from(this.filePositions.keys());
  }
}