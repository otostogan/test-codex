import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export namespace Auth {
  @ApiSchema({ name: 'RegisterDto' })
  export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;
  }

  @ApiSchema({ name: 'LoginDto' })
  export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;
  }

  @ApiSchema({ name: 'RefreshDto' })
  export class RefreshDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
  }

  @ApiSchema({ name: 'TokensDto' })
  export class TokensDto {
    @ApiProperty()
    @IsString()
    accessToken: string;

    @ApiProperty()
    @IsString()
    refreshToken: string;
  }
}
