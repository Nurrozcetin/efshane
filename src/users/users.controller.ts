import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/change-pass.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { FileFieldsInterceptor} from "@nestjs/platform-express";

const storage = diskStorage({
    destination: './uploads', 
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop(); 
        callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});

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
        console.log('User ID:', userId);
        const user = await this.userService.getUserById(userId);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile/changes')
    updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Req() req
    ) {
        console.log('User from request:', req.user);
        const userId = req.user.id;    
        if (!userId) {
            throw new UnauthorizedException('User ID bulunamadı, tekrar giriş yapın.');
        }
        return this.userService.updateUser(updateUserDto, userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Put('updateUser')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'profile_image', maxCount: 1 },
                { name: 'image_background', maxCount: 1 },
            ],
            {
                storage,
                fileFilter: (req, file, callback) => {
                    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        callback(null, true);
                    } else {
                        callback(new Error('Invalid file type'), false);
                    }
                },
            },
        ),
    )
    updateUserById(
        @UploadedFiles() files: { profile_image?: Express.Multer.File[]; image_background?: Express.Multer.File[] },
        @Body() body: UpdateUserDto,
        @Req() req
    ) {
        const userId = req.user.id;    
        const profileImage = files.profile_image?.[0]?.path;
        const backgroundImage = files.image_background?.[0]?.path;
        
        return this.userService.updateUserById(
            {
                ...body,
                profile_image: profileImage || body.profile_image,
                image_background: backgroundImage || body.image_background,
            },
            userId
        );
    }

    @Put()
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto){
        return this.userService.updatePassword(updatePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/me')
    async getMyProfile(@Req() req) {
        console.log('Gelen Token:', req.headers.authorization);
        console.log('getMyProfile - Gelen userId:', req.user?.id);
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

    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async deleteAccount(@Req() req) {
        const userId = req.user.id;
        const user = await this.userService.deleteAccount(userId);
        return user;
    }
}