import { ChangePassword } from './../users/dto/change-pass.dto';
import { BlacklistService } from './services/blacklist.service';
import { Controller, Get, Post, UseGuards, Request, Body, UnauthorizedException, Param } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { UserService } from 'src/users/users.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService,
    private readonly  userService: UserService,

  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() createUserDto: CreateUserDto, @Request() req) {
      if (!req.user) {
          throw new UnauthorizedException('User not found');
      }
      return this.authService.login(req.user);
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
  protect(@Request() req) {
    return {
      message: 'This route is protected, but this user has access',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/changepass/:id')
  async changePassword(@Param('id') id:string,
  @Body('newPass') newPass:string) {
    return this.userService.updatePassword(id, newPass);
  }
}
