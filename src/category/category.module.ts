import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CategoryService } from "./category.service";

Module({
    providers: [CategoryService, PrismaService],
    exports: [CategoryService],
})
export class CategoryModule {}