import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IPayload } from "../constants/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // Çevre değişkeni burada kullanılıyor
        });
        console.log('JWT Secret:', process.env.JWT_SECRET); // Secret'ın doğru şekilde yüklendiğini doğrulamak için
    }

    async validate(payload: IPayload) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
