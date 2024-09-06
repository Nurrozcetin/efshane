import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordService } from './services/password.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt.guards';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/auth.strategy';
import { BlacklistService } from './services/blacklist.service';

@Module({
  imports: [
    forwardRef(() => UsersModule), 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService, JwtAuthGuard, BlacklistService],
  exports: [AuthService, PasswordService, BlacklistService],
})
export class AuthModule {}
