import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginUserDto) {
    // Find user by email and include password
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Compare password
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate Tokens
    const tokens = await this.generateTokens(user);

    // Never send password back
    // delete user.password;

    return {
      user,
      ...tokens,
    };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';

    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET')!;

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET')!;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await Promise.resolve();
    console.log(userId);
    return;
    // When you implement refresh token rotation, logout should also invalidate the stored refresh token.
    // await this.usersRepository.update(userId, {
    //   hashedRefreshToken: null,
    // });
    // if using Redis:
    // await this.redisService.del(`refresh:${userId}`);
  }

  async refreshToken(refreshToken: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
    });

    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET')!;

    const accessToken = await this.jwtService.signAsync(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        sub: payload.sub,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        email: payload.email,
      },
      {
        secret: accessSecret,
        expiresIn: accessExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );

    return {
      accessToken,
    };
  }
}
