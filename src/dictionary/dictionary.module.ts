import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { DictionaryServices } from "./dictionary.service";

Module({
    providers: [DictionaryServices, PrismaService],
    exports: [DictionaryServices],
})
export class DictionaryModule {}