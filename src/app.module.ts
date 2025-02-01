import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventType } from './enums';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EventsModule } from './modules/events/events.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(EventType.MONGODB_URI),
      }),
    }),
    AuthModule,
    UserModule,
    EventsModule,
    GroupsModule,
    CommentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
