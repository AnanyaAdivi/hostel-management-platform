import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ComplaintCategory, ComplaintStatus } from '@prisma/client';

export class CreateComplaintDto {
  @IsEnum(ComplaintCategory)
  category: ComplaintCategory;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;

  @IsString()
  @IsOptional()
  adminNote?: string;
}
