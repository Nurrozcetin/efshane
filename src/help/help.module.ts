import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { HelpService } from "./help.service";
import { HelpController } from "./help.controller";

Module({
    providers: [HelpService, PrismaService],
    exports: [HelpService],
    controllers: [HelpController]
})
export class HelpModule {}