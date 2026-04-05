import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createAndSend(
    userId: string,
    title: string,
    message: string,
    type = 'info',
  ) {
    const notif = await this.prisma.notification.create({
      data: { userId, title, message, type },
    });

    this.gateway.notifyUser(userId, 'notification', notif);
    return notif;
  }

  broadcastAnnouncement(title: string, message: string, isUrgent = false) {
    this.gateway.broadcast('announcement', {
      title,
      message,
      isUrgent,
      timestamp: new Date(),
    });
  }

  async getForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }
}
