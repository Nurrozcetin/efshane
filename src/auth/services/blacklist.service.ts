import { Injectable } from "@nestjs/common";

@Injectable()
export class BlacklistService {
    private blacklist: Set<string> = new Set();

    addToken(token:string) {
        this.blacklist.add(token);
    }

    isBlacklisted(token:string): boolean {
        return this.blacklist.has(token);
    }
}