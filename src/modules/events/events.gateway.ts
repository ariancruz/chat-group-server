import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ cors: '*' })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  /*  @SubscribeMessage('createEvent')
    create(@MessageBody() createEventDto: CreateEventDto) {
      return this.eventsService.create(createEventDto);
    }

    @SubscribeMessage('findAllEvents')
    findAll() {
      return this.eventsService.findAll();
    }*/

  sendNotify(chanel: string, data: any) {
    this.server.emit(chanel, data);
  }
}
