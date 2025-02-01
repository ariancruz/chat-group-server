import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto, DecodeUser, UpdateGroupDto } from '../../models';
import { User } from '../../decorators/user.decorator';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('groups')
@ApiProduces('application/json')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@User() user: DecodeUser) {
    return this.groupsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: DecodeUser) {
    return this.groupsService.findOne(id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @User() user: DecodeUser,
  ) {
    return this.groupsService.update(id, updateGroupDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @User() user: DecodeUser) {
    return this.groupsService.remove(id, user);
  }
}
