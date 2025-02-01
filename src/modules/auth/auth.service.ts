import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventType } from '../../enums';
import { CreateUserDto, DecodeUser, Refresh, ReqRefresh } from '../../models';
import { UserDocument } from '../../schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const passwordHash = createHash('sha256').update(password).digest('hex');
      const { password: passwordStored, ...others } =
        user?.toJSON() as UserDocument;

      if (passwordStored === passwordHash) {
        const tokens = await this.generatedTokens(user);

        const { refreshToken } = tokens;
        Object.assign(user, { refreshToken });
        await user.save();
        return { ...others, ...tokens };
      } else {
        throw new BadRequestException('Invalid email or password');
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async getProfile(user: DecodeUser) {
    const { _id } = user;
    const data = await this.usersService.findOneById(_id);
    if (data) {
      return { ...data?.toJSON() };
    } else {
      throw new UnauthorizedException();
    }
  }

  async logout(user: DecodeUser): Promise<void> {
    const { _id } = user;
    await this.usersService.clearRefreshToken(_id);
  }

  async refresh(body: ReqRefresh) {
    try {
      const { refreshToken } = body;
      const secret: string = this.configService.get<string>(
        EventType.TOKEN_SECRET,
      ) as string;

      const check: DecodeUser = await this.jwtService.verifyAsync<DecodeUser>(
        refreshToken,
        { secret },
      );

      const { _id } = check;
      const data = await this.usersService.findOneById(_id);
      if (data) {
        const refresh = await this.generatedTokens(data);
        const { refreshToken: newRefreshToken } = refresh;
        Object.assign(data, { refreshToken: newRefreshToken });
        await data.save();
        return refresh;
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  async register(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  private async generatedTokens(user: UserDocument): Promise<Refresh> {
    const { _id, email, name } = user;
    const accessToken = await this.jwtService.signAsync(
      { _id, email, name },
      { expiresIn: '12h' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { _id, email },
      { expiresIn: '20h' },
    );

    return { accessToken, refreshToken };
  }
}
