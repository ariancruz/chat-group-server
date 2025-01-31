import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';
import { User } from '../../decorators/user.decorator';
import {
  DecodeUser,
  LoginCredentialsDto,
  RefreshDto,
  ReqRefresh,
  UserAuthenticatedDto,
  UserDto,
} from '../../models';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
@ApiProduces('application/json')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('profile')
  @ApiResponse({ status: 200, type: UserDto })
  async getProfile(@User() user: DecodeUser) {
    return this.authService.getProfile(user);
  }

  @Public()
  @Post('login')
  @ApiResponse({ status: 200, type: UserAuthenticatedDto })
  signIn(@Body() signInDto: LoginCredentialsDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@User() user: DecodeUser) {
    return this.authService.logout(user);
  }

  @Put('refresh')
  @ApiResponse({ status: 200, type: RefreshDto })
  refresh(@Body() data: ReqRefresh) {
    return this.authService.refresh(data);
  }
}
