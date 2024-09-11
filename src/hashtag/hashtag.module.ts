import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { HashtagService } from "./hashtag.service";

Module({
    providers: [HashtagService, PrismaService],
    exports: [HashtagService],
})
export class CategoryModule {}