import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  group: string;

  @ApiProperty({ required: false })
  ia: boolean;
}

export class UpdateCommentDto extends OmitType(CreateCommentDto, ['ia']) {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  users: string;
}
