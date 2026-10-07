import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import express from 'express';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_VALUES } from 'src/common/constants/throttle.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({
    default: THROTTLE_VALUES.AUTH,
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    // console.log(loginDto);
    // For simple send tokens in response
    // const result = await this.authService.login(loginDto);
    // return {
    //   success: true,
    //   message: 'Login successful.',
    //   data: result,
    // };
    // For send tokens in http only cookies
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: 'Login successful.',
      data: user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refreshToken = request.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found.');
    }

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return {
      success: true,
      message: 'Access token refreshed successfully.',
      data: null,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    await this.authService.logout('1');

    return {
      success: true,
      message: 'Logout successful.',
      data: null,
    };
  }

  //   @Post('forgot-password')
  //   forgotPassword() {}

  //   @Post('reset-password')
  //   resetPassword() {}
}
