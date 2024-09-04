import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { PrivateNotesService } from "./note.service";

Module({
    providers: [PrivateNotesService, PrismaService],
    exports: [PrivateNotesService],
})
export class NotesModule {}