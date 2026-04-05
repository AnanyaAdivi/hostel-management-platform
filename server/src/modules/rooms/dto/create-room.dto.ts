import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { RoomStatus } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  number: string;

  @IsInt()
  floor: number;

  @IsString()
  block: string;

  @IsInt()
  @IsOptional()
  capacity?: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}

export class AllocateRoomDto {
  @IsString()
  userId: string;

  @IsString()
  roomId: string;
}

export class UpdateRoomStatusDto {
  @IsEnum(RoomStatus)
  status: RoomStatus;
}
