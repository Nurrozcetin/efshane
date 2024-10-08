import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CommentService } from "./comment.service";

Module({
    providers: [CommentService, PrismaService],
    exports: [CommentService],
})
export class CommentModule {}