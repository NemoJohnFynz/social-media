import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' }) // Kiểm tra định dạng email
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly numberPhone?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
