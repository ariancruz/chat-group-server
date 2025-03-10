import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from '../../schemas/comments.schema';
import { GroupsModule } from '../groups/groups.module';
import { GeminiService } from './gemini.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    GroupsModule,
    EventsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, GeminiService],
})
export class CommentsModule {}
