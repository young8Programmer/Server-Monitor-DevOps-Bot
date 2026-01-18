import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): object {
    return {
      status: 'online',
      service: 'OpsPulse AI',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}