import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth as AuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private _auth: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, type: AuthDto.TokensDto })
  register(@Body() body: AuthDto.RegisterDto) {
    return this._auth.register(body.email, body.password);
  }

  @Post('login')
  @ApiResponse({ status: 200, type: AuthDto.TokensDto })
  login(@Body() body: AuthDto.LoginDto) {
    return this._auth.login(body.email, body.password);
  }

  @Post('refresh')
  @ApiResponse({ status: 200, type: AuthDto.TokensDto })
  refresh(@Body() body: AuthDto.RefreshDto) {
    return this._auth.refresh(body.refreshToken);
  }
}
