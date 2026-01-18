import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class MonitoringService {
  async getSystemStatus() {
    const [cpu, mem, fsSize, time] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.time(),
    ]);

    const disk = fsSize[0] || { used: 0, size: 0 };

    const memUsedGB = (mem.used / (1024 ** 3)).toFixed(2);
    const memTotalGB = (mem.total / (1024 ** 3)).toFixed(2);
    const memUsagePercent = ((mem.used / mem.total) * 100).toFixed(1);

    const diskUsedGB = (disk.used / (1024 ** 3)).toFixed(2);
    const diskTotalGB = (disk.size / (1024 ** 3)).toFixed(2);
    const diskUsagePercent = ((disk.used / disk.size) * 100).toFixed(1);

    const uptimeSeconds = time.uptime;
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const [load] = await si.currentLoad();

    return {
      cpu: {
        usage: cpu.currentLoad.toFixed(1),
      },
      mem: {
        used: memUsagePercent,
        usedGB: memUsedGB,
        totalGB: memTotalGB,
        available: (mem.available / (1024 ** 3)).toFixed(2),
      },
      disk: {
        used: diskUsagePercent,
        usedGB: diskUsedGB,
        totalGB: diskTotalGB,
        freeGB: ((disk.size - disk.used) / (1024 ** 3)).toFixed(2),
      },
      uptime: uptimeString,
      loadAverage: [
        load.avgLoad?.toFixed(2) || '0.00',
        (await si.currentLoad()).avgLoad?.toFixed(2) || '0.00',
        (await si.currentLoad()).avgLoad?.toFixed(2) || '0.00',
      ],
    };
  }

  async getDetailedStats() {
    const [cpu, mem, fsSize, cpuInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpu(),
    ]);

    const disk = fsSize[0] || { used: 0, size: 0 };

    const memUsedGB = (mem.used / (1024 ** 3)).toFixed(2);
    const memTotalGB = (mem.total / (1024 ** 3)).toFixed(2);
    const memUsagePercent = ((mem.used / mem.total) * 100).toFixed(1);
    const memAvailableGB = (mem.available / (1024 ** 3)).toFixed(2);

    const diskUsedGB = (disk.used / (1024 ** 3)).toFixed(2);
    const diskTotalGB = (disk.size / (1024 ** 3)).toFixed(2);
    const diskUsagePercent = ((disk.used / disk.size) * 100).toFixed(1);
    const diskFreeGB = ((disk.size - disk.used) / (1024 ** 3)).toFixed(2);

    return {
      cpu: {
        usage: cpu.currentLoad.toFixed(1),
        cores: cpuInfo.cores,
        model: cpuInfo.manufacturer + ' ' + cpuInfo.brand,
      },
      mem: {
        used: memUsagePercent,
        usedGB: memUsedGB,
        totalGB: memTotalGB,
        availableGB: memAvailableGB,
      },
      disk: {
        used: diskUsagePercent,
        usedGB: diskUsedGB,
        totalGB: diskTotalGB,
        freeGB: diskFreeGB,
      },
    };
  }

  async checkRamThreshold(threshold: number): Promise<{ exceeded: boolean; usage: number }> {
    const mem = await si.mem();
    const usagePercent = (mem.used / mem.total) * 100;
    
    return {
      exceeded: usagePercent > threshold,
      usage: parseFloat(usagePercent.toFixed(1)),
    };
  }
}