import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guards';


@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
      console.log('login olucaz');
      console.log('Request User:', req.user); // req.user'ın içeriğini kontrol edin
      if (!req.user) {
          throw new UnauthorizedException('User not found');
      }
      return this.authService.login(req.user);
  }


  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('register olucaz')
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  protect(@Request() req) {
    return {
      message: 'This route is protected, but this user has access',
      user: req.user,
    };
  }
}
