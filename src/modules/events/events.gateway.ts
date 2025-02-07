import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { EventsWs } from '../../enums';

@WebSocketGateway({ cors: '*' })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  /*  @SubscribeMessage('createEvent')
    create(@MessageBody() createEventDto: CreateEventDto) {
      return this.eventsService.create(createEventDto);
    }*/

  @SubscribeMessage('typing')
  findAll(@MessageBody() data: { id: string; users: string[]; name: string }) {
    const { id, users, name } = data;

    users.forEach((user) => {
      const channel = EventsWs.TYPING + ':' + id + ':' + user;
      this.server.emit(channel, { name });
    });
  }

  sendNotify(chanel: string, data: any) {
    this.server.emit(chanel, data);
  }
}
