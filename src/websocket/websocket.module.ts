import { Module } from '@nestjs/common';
import { WebSocketGateway as WSGateway } from './websocket.gateway';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule],
  providers: [WSGateway],
  exports: [WSGateway],
})
export class WebSocketModule {}