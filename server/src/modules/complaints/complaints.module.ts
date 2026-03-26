import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { AnonymousService } from './anonymous.service';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';

@Module({
  imports: [NotificationsModule],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, AnonymousService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
