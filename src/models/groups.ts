import { ApiProperty } from '@nestjs/swagger';

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
