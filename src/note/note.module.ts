import { Module } from "@nestjs/common";
import { NotesServices } from "./note.service";
import { PrismaService } from "prisma/prisma.service";

Module({
    providers: [NotesServices, PrismaService],
    exports: [NotesServices],
})
export class NotesModule {}