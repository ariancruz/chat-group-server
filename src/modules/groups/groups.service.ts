import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Groups } from '../../schemas/groups.schema';
import {
  CreateGroupDto,
  DecodeUser,
  GroupLight,
  UpdateGroupDto,
} from '../../models';
import { EventsGateway } from '../events/events.gateway';
import { EventsWs } from '../../enums';
import { difference } from 'lodash';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups.name) private groupModel: Model<Groups>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(createGroupDto: CreateGroupDto, userReq: DecodeUser) {
    const { users, name } = createGroupDto;
    const { _id: owner } = userReq;
    const _id = new Types.ObjectId();
    const group = await new this.groupModel({ ...createGroupDto, _id }).save();

    this.notifyUsers(
      EventsWs.ADD_GROUP,
      users.filter((f) => f !== owner),
      { _id, name },
    );
    return group;
  }

  findAll(user: DecodeUser) {
    const { _id } = user;
    return this.groupModel
      .find({ users: { $in: [_id] } })
      .select('name')
      .exec();
  }

  findOne(id: string, user: DecodeUser) {
    const { _id } = user;
    return this.groupModel
      .findOne({ _id: new Types.ObjectId(id), users: { $in: [_id] } })
      .populate('users', ['name', 'email'])
      .exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, user: DecodeUser) {
    const { _id: userId } = user;
    const { users, name } = updateGroupDto;
    const group = await this.groupModel
      .findOne({ _id: new Types.ObjectId(id), users: { $in: [userId] } })
      .exec();
    if (group) {
      const userRaw: object[] = group?.toJSON()['users'] || [];
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const actual = userRaw.map((u) => u.toString());

      const newUser = difference(users, actual);
      const removedUser = difference(actual, users);
      const updateUser = difference(actual, [...newUser, ...removedUser]);

      this.notifyUsers(EventsWs.ADD_GROUP, newUser, { _id: id, name });
      this.notifyUsers(EventsWs.UPDATE_GROUP, updateUser, { _id: id, name });
      this.notifyUsers(EventsWs.REMOVED_GROUP, removedUser, { _id: id });

      await group?.updateOne({ name, users }).exec();
    }
  }

  async remove(id: string, user: DecodeUser) {
    const { _id } = user;
    const idGroup = new Types.ObjectId(id);
    const group = await this.groupModel.findByIdAndUpdate(idGroup, {
      $pull: {
        users: _id,
      },
    });
    if (group && group.users.length === 0) {
      return this.groupModel.findByIdAndDelete(idGroup);
    }
  }

  async isInGroup(groupId: string, userId: string) {
    const g = await this.groupModel
      .findOne({
        _id: new Types.ObjectId(groupId),
        users: { $in: [userId] },
      })
      .exec();
    return !!g;
  }

  notifyUsers(event: EventsWs, users: string[], data: Partial<GroupLight>) {
    users.forEach((user) => {
      const channel = user + ':' + event;
      this.eventsGateway.sendNotify(channel, data);
    });
  }
}
