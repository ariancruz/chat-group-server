import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from '../../models/comments';
import { DecodeUser } from '../../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments } from '../../schemas/comments.schema';
import { GroupsService } from '../groups/groups.service';
import { GeminiService } from './gemini.service';
import { EventsGateway } from '../events/events.gateway';
import { EventsWs } from '../../enums';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
    private groupsService: GroupsService,
    private geminiService: GeminiService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: DecodeUser) {
    const { _id, name } = user;
    const { group, data, ia } = createCommentDto;
    if (await this.checkUserAllow(group, user)) {
      if (ia) {
        this.geminiService
          .generateText(data)
          .then((result) => {
            return new this.commentsModel({
              _id: new Types.ObjectId(),
              name: 'Gemini',
              user: new Types.ObjectId(),
              data: result,
              group: new Types.ObjectId(group),
            }).save();
          })
          .then((ws) => {
            const comment = ws?.toObject();
            const channel = group + ':' + EventsWs.NEW_COMMENT;
            this.eventsGateway.sendNotify(channel, comment);
          });
      }
      return new this.commentsModel({
        _id: new Types.ObjectId(),
        name,
        user: new Types.ObjectId(_id),
        data,
        group: new Types.ObjectId(group),
      }).save();
    }
  }

  async findAll(id: string, user: DecodeUser) {
    if (await this.checkUserAllow(id, user)) {
      return this.commentsModel.find({ group: new Types.ObjectId(id) }).exec();
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: DecodeUser,
  ) {
    const { data, group } = updateCommentDto;
    if (await this.checkUserAllow(group, user)) {
      return this.commentsModel
        .findByIdAndUpdate(new Types.ObjectId(id), { data }, { new: true })
        .exec();
    }
  }

  async remove(id: string, user: DecodeUser) {
    const { _id } = user;
    return this.commentsModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      user: new Types.ObjectId(_id),
    });
  }

  private async checkUserAllow(groupId: string, user: DecodeUser) {
    const { _id } = user;
    if (await this.groupsService.isInGroup(groupId, _id)) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
