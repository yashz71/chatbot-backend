import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 🛡️ Change: Extract from cookies instead of headers
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No session found');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // Mapping the payload to the request for your @Req() req in controllers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    // Ensure the name 'access_token' matches what you set in your Login method
    return request.cookies?.['access_token'];
  }
}