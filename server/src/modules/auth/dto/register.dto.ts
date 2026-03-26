import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  avatarUrl: string;

  @IsString()
  enrollmentNo: string;

  @IsString()
  course: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  sportsInterests: string[];

  @IsString()
  careerGoal: string;

  @IsString()
  address: string;

  @IsString()
  parentContactNo: string;
}
