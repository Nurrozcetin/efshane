import { UpdatePasswordDto } from './dto/change-pass.dto';
import { PasswordService } from './../auth/services/password.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { MailerService } from 'src/mailer/mailer.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
    const defaultImage = "/images/user.jpeg";
    const defaultBg = "/images/bg.jpg";
    const { email, username, password, birthdate, date, name} = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
          username: username
      }
  });

  if (existingUser) {
    throw new ConflictException('Bu kullanıcı adına ait bir hesap mevcut');
  }

    const birthDateObj = new Date(birthdate);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        name,
        image_background: defaultBg,
        profile_image: defaultImage,
        password,
        birthdate: birthDateObj,
        date: date
      },
    });
    await this.mailerService.sendMail(
      user.email, 
      "Hoş Geldin! 🎉 Efshane'de Harika Bir Kitap Yolculuğuna Hazır mısın?", 
      "Efshane ailesine katıldığın için çok heyecanlıyız! 🎉🎉 \nBu zengin, yaratıcı ve büyülü dünyaya adım attın! Hem bir okuyucu hem de bir yazar olarak kendini ifade edebileceğin, hayal gücünün sınırlarını zorlayabileceğin bir yolculuğa başlıyorsun. \nBurada seni bekleyenler: \n📚 Sonsuz Kitap Denizi: Her kategoriye göz atarak sevdiğin türlerdeki kitapları keşfet, okumaya başla ve hatta notlar ekleyerek kitaplara kendi yorumunu kat. \n🖋️ Yaratıcılığını Paylaş: Yazdığın kitapları geniş bir kitleyle paylaş, hikayelerini bölümlere ayır, ve sesli kitap formatına dönüştürerek daha fazla kişiye ulaş! \n📣 Yazarlarla ve Okuyucularla Etkileşim: Yazarların duyurularını Twitter benzeri bir akış sisteminde takip et, mesajlaş ve topluluğumuzun bir parçası ol! \n🔔 Anında Bildirimler: Yazarlar yeni bölüm eklediğinde veya duyuru yaptığında hemen haberdar ol. En sevdiğin yazarların gelişmelerini kaçırma! \n🎧 Sesli Kitap Macerası: Kitapları sadece okumakla kalma, aynı zamanda sesli kitaplar oluştur ve dinle. Sesli kitap oluştururken yapay zekamızın uygunsuz içerik kontrolüyle güvende olduğunu bil! \nEfshane'de seninle bir arada olmak bizim için büyük bir mutluluk. Hadi hemen keşfe çık ve kitap dolu bir dünyaya adım at! \n🤩 Soruların mı var? Yardıma mı ihtiyacın var? Bize her zaman ulaşabilirsin! Efshane ailesi olarak her zaman senin yanındayız. \n💬 Tekrar hoş geldin ve keyifli okumalar... \nEFshane Ekibi"
    );
    return user;
  }

  async getUserByEmail(email:string){
    const user = await this.prisma.user.findUnique({
      where: {email:email},
    })
    if(!user){
      throw new NotFoundException();
    }
    return user;
  }

  async getUserById(userId: number) {
    if (!userId || typeof userId !== 'number') {
        throw new BadRequestException("Invalid user ID provided.");
    }

    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            birthdate: true,
            email: true,
            password: true,
            profile_image: true,
        },
    });

    if (!user) {
        throw new NotFoundException("User not found.");
    }
    return user;
  }

  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        name: true,
        profile_image: true,
        about: true,
        date: true,
        image_background: true,
        _count: {
          select: {
            followers: true, 
            following: true, 
          },
        },
      },
    });
  
    const defaultProfileImage = '/images/user.jpeg';
    const formattedUser = {
      ...user,
      image_background: user.image_background || '',
      profile_image: user.profile_image || defaultProfileImage,
      followersCount: user?._count?.followers || 0,
      followingCount: user?._count?.following || 0,
    };
  
    return formattedUser;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const {email, pass} = updatePasswordDto;
    const user = await this.getUserByEmail(email);
    const hashedPass = await this.passwordService.hashPassword(pass);
    await this.prisma.user.update({
      where: { email: user.email},
      data: { password: hashedPass },
    });
    return { message: 'Updated password' };
  }

  async updateUserById(updateUserDto:UpdateUserDto, userId:number){
    const {name, profile_image, image_background, about } = updateUserDto;
    const user = await this.prisma.user.update({
      where: {id: userId},
      data: {
        name,
        profile_image,
        image_background,
        about,
      },
    });
    if(!user){
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number) {
    console.log('adldkfna');
    const { username, email, birthdate } = updateUserDto;

    const existingUser = await this.prisma.user.findUnique({
        where: { id: userId }
    });

    if (!existingUser) {
        throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (birthdate) updateData.birthdate = new Date(birthdate); 

    try {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return user;
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        throw new InternalServerErrorException('Güncelleme başarısız!');
    }
  }

  async getProfileByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        name: true,
        profile_image: true,
        about: true,
        date: true,
        image_background: true,
        _count: {
          select: {
            followers: true, 
            following: true, 
          },
        },
      },
    });
    const formattedUser = {
      ...user,
      name: user.name || '',
      image_background: user.image_background || '',
      profile_image: user.profile_image || '',
      followersCount: user?._count?.followers || 0,
      followingCount: user?._count?.following || 0,
    };
    return formattedUser;
  }

  async deleteAccount(userId: number) {
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });
    return user;
  }
}
