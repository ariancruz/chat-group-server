import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from '../../schemas/groups.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Groups.name, schema: GroupsSchema }]),
    EventsModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
