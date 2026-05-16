import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes,  Request, Res,
  ValidationPipe,  UseGuards, Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto,@Res({ passthrough: true }) response: express.Response) {
    const { user, access_token } = await this.authService.register(createUserDto);
    this.setCookie(response, access_token);
    return user; // Return user info for Angular Signal
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto,@Res({ passthrough: true }) response: express.Response) {
    const { user, access_token } = await this.authService.login(loginDto);
    this.setCookie(response, access_token);
    return user;
    }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  private setCookie(response: express.Response, token: string) {
    response.cookie('access_token', token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in prod
      sameSite: 'lax', // CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  }
}