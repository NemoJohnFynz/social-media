import { IsBoolean, IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly firstName: string;

    @IsOptional()
    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsString()
    readonly address: string;
    @IsOptional()
    @IsBoolean()
    readonly gender: string;

    @IsOptional()
    @IsString()
    readonly birthday: string;
}