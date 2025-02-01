import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Groups } from '../../schemas/groups.schema';
import { CreateGroupDto, DecodeUser, UpdateGroupDto } from '../../models';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Groups.name) private groupModel: Model<Groups>) {}

  create(createGroupDto: CreateGroupDto) {
    return new this.groupModel({
      ...createGroupDto,
      _id: new Types.ObjectId(),
    }).save();
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
      .find({ _id: new Types.ObjectId(id), users: { $in: [_id] } })
      .populate('users', ['name', 'email'])
      .exec();
  }

  update(id: string, updateGroupDto: UpdateGroupDto, user: DecodeUser) {
    const { _id: userId } = user;
    const { _id, ...updateDto } = updateGroupDto;
    return this.groupModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), users: { $in: [userId] } },
        updateDto,
      )
      .exec();
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
}
