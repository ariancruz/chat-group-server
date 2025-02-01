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
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../../models/comments';
import { DecodeUser } from '../../models';
import { User } from '../../decorators/user.decorator';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@ApiProduces('application/json')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: DecodeUser) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get('by-group/:id')
  findAll(@Param('id') id: string, @User() user: DecodeUser) {
    return this.commentsService.findAll(id, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: DecodeUser,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @User() user: DecodeUser) {
    return this.commentsService.remove(id, user);
  }
}
