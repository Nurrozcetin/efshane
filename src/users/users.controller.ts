import { User } from '@prisma/client';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/change-pass.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Get('all')
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Post()
    createUser(@Body() body: CreateUserDto){
        return this.userService.createUser(body);
    }

    @Get(':email')
    getUserByEmail(@Param('email') email:string){
        return this.userService.getUserByEmail(String(email));
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Req() req) {
        const userId = req.user?.id;
        const user = await this.userService.getUserById(userId);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('updateUser')
    updateUserById(
        @Body() body: UpdateUserDto,
        @Req() req
    ){
        const userId = req.user.id;
        return this.userService.updateUserById(body, userId);
    }

    @Put()
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto){
        return this.userService.updatePassword(updatePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/me')
    async getMyProfile(@Req() req) {
        const userId = req.user?.id;
        const user = await this.userService.getMyProfile(userId);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:username') 
    async getProfileByUsername(
        @Param('username') username: string, 
    ) {
        const user = await this.userService.getProfileByUsername(username);
        return user;
    }
}