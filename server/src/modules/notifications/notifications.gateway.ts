import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getAllowedOrigins } from '../../common/utils/allowed-origins';

type SocketPayload = {
  sub: string;
  role: string;
};

@WebSocketGateway({
  cors: { origin: getAllowedOrigins(), credentials: true },
  namespace: '/',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('NotificationsGateway');
  private readonly connectedUsers = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const auth = (client.handshake.auth || {}) as { token?: unknown };
      const header = client.handshake.headers?.authorization;
      const authHeader =
        typeof header === 'string'
          ? header
          : Array.isArray(header)
            ? header[0]
            : undefined;

      const tokenFromHeader = authHeader?.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : undefined;
      const token =
        typeof auth.token === 'string' ? auth.token : tokenFromHeader;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<SocketPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      this.connectedUsers.set(payload.sub, client.id);
      (client.data as { userId?: string }).userId = payload.sub;
      void client.join(`user:${payload.sub}`);
      void client.join(`role:${payload.role}`);
      this.logger.log(`User connected: ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as { userId?: string } | undefined)?.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { ok: true });
  }

  notifyUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  notifyRole(role: string, event: string, data: unknown) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  broadcast(event: string, data: unknown) {
    this.server.emit(event, data);
  }
}
