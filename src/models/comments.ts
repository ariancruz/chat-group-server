import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  group: string;
}

export class UpdateCommentDto extends CreateCommentDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  users: string;
}
