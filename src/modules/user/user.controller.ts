import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  DecodeUser,
  UpdatePassword,
  UserDto,
  UserUpdateDto,
} from '../../models';
import { User } from '../../decorators/user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@ApiProduces('application/json')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  async getAll() {
    const data = await this.userService.findAll();
    return data.map((user) => user.toJSON());
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserDto })
  async getOne(@Param('id') id: string) {
    const data = await this.userService.findOneById(id);
    return data?.toJSON();
  }

  @Put()
  @ApiResponse({ status: 200, type: UserDto })
  async update(@Body() data: UserUpdateDto) {
    return this.userService.update(data);
  }

  @Patch('update-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() data: UpdatePassword, @User() user: DecodeUser) {
    return this.userService.updatePassword(data, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    return this.userService.destroy(id);
  }
}
