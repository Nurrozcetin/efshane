import { BlacklistService } from './services/blacklist.service';
import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException, Param, Req } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { UserService } from 'src/users/users.service';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
      if (!req.user) {
          throw new UnauthorizedException('User not found');
      }
      const {accessToken} = await this.authService.login(req.user);
      console.log(accessToken);
      return { accessToken };
  }

  @Post('/logout') 
  async logout(@Request() req) {
    const token = req.headers['authorization']?.replace('Bearer', '');
    if(token) {
      this.blacklistService.addToken(token);
    }
    return  { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  protect(@Req() req) {
    return {
      message: 'This route is protected, but this user has access',
      user: req.user,
    };
  }
}
