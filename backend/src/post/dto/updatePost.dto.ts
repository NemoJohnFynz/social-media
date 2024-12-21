import { IsOptional, IsString, IsArray, IsEnum } from "class-validator"
import { Types } from "mongoose";

export class UpdatePostDto{

    @IsOptional()
    @IsString()
    readonly content: string

    @IsOptional()
    @IsString()
    readonly img?:string[]
}