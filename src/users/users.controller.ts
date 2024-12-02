import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDto } from "./dto/user.dto";
import { UpdatePasswordDto } from "./dto/change-pass.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

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
        if (!userId) {
            throw new BadRequestException("Invalid user ID provided.");
        }

        const user = await this.userService.getUserById(userId);
        return user;
    }

    @Delete(':id')
    deleteUserById(@Param('id') id:string){
        return this.userService.deleteUserById(Number(id));
    }

    @Put(':id')
    updateUserById(@Body() body: UserDto, @Param('id') id:string){
        return this.userService.updateUserById(body, Number(id));
    }

    @Put()
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto){
        return this.userService.updatePassword(updatePasswordDto);
    }
}