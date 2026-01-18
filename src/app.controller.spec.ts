import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getStatus', () => {
    it('should return status object', () => {
      const result = appController.getStatus();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('service');
      expect(result).toHaveProperty('version');
    });
  });
});