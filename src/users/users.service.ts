import { PasswordService } from './../auth/services/password.service';
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async getAllUsers(){
    return this.prisma.user.findMany()
  }

  async createUser(createUserDto:CreateUserDto): Promise<User> {
    const { email, username, password, age, profile_image, image_background, about } = createUserDto;
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password,
        age,
        profile_image,
        image_background,
        about
      },
    });
    return user;
  }

  async getUserByEmail(email:string){
    const user = await this.prisma.user.findUnique({
      where: {email},
    })
    if(!user){
      throw new NotFoundException();
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
        where: { id:parseInt(id)},
    });
    if (!user) {
        throw new NotFoundException();
    }
    return user;
}

async updatePassword(id:string, newPass: string) {
  const user = await this.getUserById(id);
  const hashedPass = await this.passwordService.hashPassword(newPass);
  
  await this.prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPass },
  });

  return { message: 'Updated password' };
}

  async deleteUserById(id:number){
    return this.prisma.user.delete({
      where: {id},
    });
  }

  async updateUserById(createUserDto:CreateUserDto, id:number): Promise<User> {
    const { email, username, password, age, profile_image, image_background, about } = createUserDto;
    const user = await this.prisma.user.update({
      where: {id},
      data: {
        email,
        username,
        password,
        profile_image,
        age,
        image_background,
        about
      },
    });
    if(!user){
      throw new NotFoundException();
    }
    return user;
  }
}