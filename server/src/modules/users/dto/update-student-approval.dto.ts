import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class UpdateStudentApprovalDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @IsString()
  @IsOptional()
  approvedBy?: string;
}
