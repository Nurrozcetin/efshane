import { BlacklistService } from './../services/blacklist.service';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IPayload } from "../constants/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly blacklistService: BlacklistService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: IPayload){
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if(this.blacklistService.isBlacklisted(token)) {
            throw new UnauthorizedException('Token is blacklisted')
        }
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
