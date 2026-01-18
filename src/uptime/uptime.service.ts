import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

export interface UptimeCheckResult {
  url: string;
  status: 'online' | 'offline' | 'error';
  statusCode?: number;
  responseTime?: number;
  message?: string;
}

@Injectable()
export class UptimeService {
  async checkUrl(url: string): Promise<UptimeCheckResult> {
    const startTime = Date.now();

    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10 seconds
        validateStatus: (status) => status < 500, // Consider 4xx as online
      });

      const responseTime = Date.now() - startTime;

      if (response.status >= 500) {
        return {
          url,
          status: 'offline',
          statusCode: response.status,
          responseTime,
          message: `Server returned ${response.status}`,
        };
      }

      return {
        url,
        status: 'online',
        statusCode: response.status,
        responseTime,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const responseTime = Date.now() - startTime;

      if (axiosError.response) {
        // Server responded with error status
        if (axiosError.response.status >= 500) {
          return {
            url,
            status: 'offline',
            statusCode: axiosError.response.status,
            responseTime,
            message: `Server error: ${axiosError.response.status}`,
          };
        }
      }

      return {
        url,
        status: 'error',
        responseTime,
        message: axiosError.message || 'Unknown error',
      };
    }
  }

  async checkMultipleUrls(urls: string[]): Promise<UptimeCheckResult[]> {
    const checks = urls.map(url => this.checkUrl(url));
    return Promise.all(checks);
  }
}