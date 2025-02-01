import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginCredentialsDto {
  @ApiProperty({ default: 'admin@booking.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '123456' })
  password: string;
}

export class ReqRefresh {
  @ApiProperty()
  refreshToken: string;
}

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserUpdateDto extends OmitType(CreateUserDto, ['password']) {
  @ApiProperty()
  _id: string;
}

export class UserDto extends OmitType(CreateUserDto, ['password']) {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RefreshDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class UserAuthenticatedDto extends IntersectionType(
  UserDto,
  RefreshDto,
) {}

export type Refresh = { accessToken: string; refreshToken: string };

export class ResetPassword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  password: string;
}

export class UpdatePassword {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export type ReqUser = Request & { user: DecodeUser };

export type DecodeUser = {
  _id: string;
  name: string;
  email: string;
};
