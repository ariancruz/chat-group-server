import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { createHash } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from '../../schemas/user.schema';
import {
  CreateUserDto,
  DecodeUser,
  UpdatePassword,
  UserUpdateDto,
} from '../../models';

@Injectable()
export class UserService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async findOneById(id: string) {
    return this.userModel
      .findById(new Types.ObjectId(id))
      .select(['-password'])
      .exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(id), { refreshToken: null })
      .exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select(['-password', '-refreshToken']).exec();
  }

  async create(data: CreateUserDto): Promise<Omit<Users, 'password'>> {
    let { password } = data;
    password = createHash('sha256').update(password).digest('hex');
    const user = await new this.userModel({
      ...data,
      password,
      _id: new Types.ObjectId(),
    }).save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omit, ...others } = user.toJSON();
    return others;
  }

  async update(data: UserUpdateDto) {
    const { _id, ...update } = data;
    return this.userModel
      .findByIdAndUpdate(new Types.ObjectId(_id), update, { new: true })
      .select(['-password', '-refreshToken'])
      .exec();
  }

  async updatePassword(data: UpdatePassword, user: DecodeUser): Promise<void> {
    const { _id } = user;
    const { newPassword, oldPassword } = data;

    const userStore = await this.userModel.findById(new Types.ObjectId(_id));
    if (userStore) {
      const passwordHash = createHash('sha256')
        .update(oldPassword)
        .digest('hex');
      const { password: passwordStored } = userStore;
      if (passwordStored === passwordHash) {
        const password = createHash('sha256').update(newPassword).digest('hex');
        Object.assign(userStore, { password });
        await userStore.save();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async destroy(id: string) {
    return this.userModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
