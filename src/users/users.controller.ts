import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDto } from "./dto/user.dto";

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Get()
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

    @Delete(':id')
    deleteUserById(@Param('id') id:string){
        return this.userService.deleteUserById(Number(id));
    }

    @Put(':id')
    updateUserById(@Body() body: UserDto, @Param('id') id:string){
        return this.userService.updateUserById(body, Number(id));
    }
}