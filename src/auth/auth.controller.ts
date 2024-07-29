import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export type AuthBody = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param authBody qui permet de s'authentifier
   * @returns
   */
  @Post('login')
  async login(@Body() authBody: AuthBody) {
    return await this.authService.login({authBody});
  }
}
