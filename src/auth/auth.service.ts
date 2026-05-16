import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private async generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }
  // 1. Register Method
  async register(createUserDto: CreateUserDto) {
    // Simply delegate to UsersService which handles hashing
    const user = await this.usersService.create(createUserDto);
    return this.generateToken(user);
  }

  // 2. Login Method
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log("login succesful")

    return this.generateToken(user);
  }
}