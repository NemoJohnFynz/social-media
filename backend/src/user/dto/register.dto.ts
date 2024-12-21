import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @ValidateIf((o) => !o.email) // Chỉ validate nếu email không được cung cấp
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required if email is not provided' })
  readonly numberPhone?: string;

  @ValidateIf((o) => !o.numberPhone) // Chỉ validate nếu số điện thoại không được cung cấp
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required if phone number is not provided' })
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly gender: string; //true is male, false is female

  @IsString()
  @IsNotEmpty()
  readonly birthday: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
