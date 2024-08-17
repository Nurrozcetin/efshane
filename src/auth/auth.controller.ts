import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local.guards";
import { AuthService } from "./services/auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtAuthguard } from "./guards/jwt.guards";

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthguard)
  @Get('/protected')
  protect(@Request() req) {
    return {
      message: 'This route is protected, but this user has access',
      user: req.user,
    };
  }
}