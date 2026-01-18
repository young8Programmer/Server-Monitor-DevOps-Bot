import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MonitoringService } from '../monitoring/monitoring.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/status',
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private monitoringService: MonitoringService) {}

  onModuleInit() {
    // Start broadcasting status every 5 seconds
    this.broadcastStatus();
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send initial status on connection
    this.sendStatusToClient(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('requestStatus')
  async handleRequestStatus(client: Socket) {
    await this.sendStatusToClient(client);
  }

  private async sendStatusToClient(client: Socket) {
    try {
      const status = await this.monitoringService.getSystemStatus();
      client.emit('systemStatus', status);
    } catch (error) {
      client.emit('error', { message: 'Failed to fetch system status' });
    }
  }

  // Broadcast status to all connected clients every 5 seconds
  @Cron(CronExpression.EVERY_5_SECONDS)
  private async broadcastStatus() {
    try {
      const status = await this.monitoringService.getSystemStatus();
      this.server.emit('systemStatus', status);
    } catch (error) {
      console.error('Failed to broadcast status:', error);
    }
  }

  // Manual broadcast method (can be called from other services)
  async broadcastAlert(alert: { type: string; message: string; data?: any }) {
    this.server.emit('alert', alert);
  }
}