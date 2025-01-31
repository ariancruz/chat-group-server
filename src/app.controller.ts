import { Controller, Get } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
@ApiProduces('application/json')
export class AppController {
  @Public()
  @Get()
  @ApiResponse({ status: 200, type: Object })
  getHealth() {
    return { status: 'ok' };
  }
}
