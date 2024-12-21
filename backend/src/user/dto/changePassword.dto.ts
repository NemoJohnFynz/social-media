import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    readonly currentPassword: string;

    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;
}