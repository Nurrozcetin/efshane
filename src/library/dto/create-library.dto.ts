import { IsInt, IsNotEmpty} from "class-validator";
export class CreateLibrary {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsInt()
    bookIds: number[];

    @IsNotEmpty()
    @IsInt()
    audioBookIds: number[];
}
