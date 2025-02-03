import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateGroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  users: string[];
}

export class UpdateGroupDto extends CreateGroupDto {
  @ApiProperty()
  _id: string;
}

export interface GroupLight {
  _id: string | Types.ObjectId;
  name: string;
}
