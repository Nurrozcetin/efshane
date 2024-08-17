import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllUsers(){
    return this.prisma.user.findMany()
  }

  async createUser(createUserDto:CreateUserDto): Promise<User> {
    const { email, username, password, age, image, image_background, about } = createUserDto;
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password,
        age,
        image,
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

  async deleteUserById(id:number){
    return this.prisma.user.delete({
      where: {id},
    });
  }

  async updateUserById(createUserDto:CreateUserDto, id:number): Promise<User> {
    const { email, username, password, age, image, image_background, about } = createUserDto;
    
    const user = await this.prisma.user.update({
      where: {id},
      data: {
        email,
        username,
        password,
        age,
        image,
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