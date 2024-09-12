import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FollowingService } from "./following.service";

Module({
    providers: [FollowingService, PrismaService],
    exports: [FollowingService],
})
export class FollowingModule {}