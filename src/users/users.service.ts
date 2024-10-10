import { PasswordService } from './../auth/services/password.service';
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDto } from "./dto/user.dto";
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService,
  ) {}

  async getAllUsers(){
    return this.prisma.user.findMany()
  }

  async createUser(createUserDto:CreateUserDto): Promise<User> {
    const { email, username, password, birthdate} = createUserDto;
    const birthDateObj = new Date(birthdate);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password,
        birthdate: birthDateObj
      },
    });
    await this.mailerService.sendMail(
      user.email, 
      "Hoş Geldin! 🎉 Efshane'de Harika Bir Kitap Yolculuğuna Hazır mısın?", 
      "Efshane ailesine katıldığın için çok heyecanlıyız! 🎉🎉 \nBu zengin, yaratıcı ve büyülü dünyaya adım attın! Hem bir okuyucu hem de bir yazar olarak kendini ifade edebileceğin, hayal gücünün sınırlarını zorlayabileceğin bir yolculuğa başlıyorsun. \nBurada seni bekleyenler: \n📚 Sonsuz Kitap Denizi: Her kategoriye göz atarak sevdiğin türlerdeki kitapları keşfet, okumaya başla ve hatta notlar ekleyerek kitaplara kendi yorumunu kat. \n🖋️ Yaratıcılığını Paylaş: Yazdığın kitapları geniş bir kitleyle paylaş, hikayelerini bölümlere ayır, ve sesli kitap formatına dönüştürerek daha fazla kişiye ulaş! \n📣 Yazarlarla ve Okuyucularla Etkileşim: Yazarların duyurularını Twitter benzeri bir akış sisteminde takip et, mesajlaş ve topluluğumuzun bir parçası ol! \n🔔 Anında Bildirimler: Yazarlar yeni bölüm eklediğinde veya duyuru yaptığında hemen haberdar ol. En sevdiğin yazarların gelişmelerini kaçırma! \n🎧 Sesli Kitap Macerası: Kitapları sadece okumakla kalma, aynı zamanda sesli kitaplar oluştur ve dinle. Sesli kitap oluştururken yapay zekamızın uygunsuz içerik kontrolüyle güvende olduğunu bil! \nEfshane'de seninle bir arada olmak bizim için büyük bir mutluluk. Hadi hemen keşfe çık ve kitap dolu bir dünyaya adım at! \n🤩 Soruların mı var? Yardıma mı ihtiyacın var? Bize her zaman ulaşabilirsin! Efshane ailesi olarak her zaman senin yanındayız. \n💬 Tekrar hoş geldin ve keyifli okumalar \nEfshane Ekibi"
    );
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

  async updateUserById(userDto:UserDto, id:number): Promise<User> {
    const { email, username, password, age, profile_image, image_background, about, birthdate
     } = userDto;
    const user = await this.prisma.user.update({
      where: {id},
      data: {
        email,
        username,
        password,
        profile_image,
        age,
        image_background,
        about,
        birthdate
      },
    });
    if(!user){
      throw new NotFoundException();
    }
    return user;
  }
}
