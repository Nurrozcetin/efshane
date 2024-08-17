import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordService } from './services/password.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/auth.strategy';
import { JwtAuthguard } from './guards/jwt.guards';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),  // ConfigModule'ü ekleyin
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService, JwtAuthguard],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
