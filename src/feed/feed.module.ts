import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service"; 
import { FeedService } from "./feed.service";

Module({
    providers: [FeedService, PrismaService],
    exports: [FeedService],
})
export class FeedModule {}