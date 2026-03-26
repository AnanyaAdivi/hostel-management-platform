import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateStudentApprovalDto } from './dto/update-student-approval.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'WARDEN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  listStudents(
    @Query('sortBy') sortBy?: 'course' | 'sports' | 'career' | 'approval',
    @Query('approvalStatus') approvalStatus?: ApprovalStatus,
  ) {
    return this.usersService.listStudents(sortBy, approvalStatus);
  }

  @Patch('students/:id/approval')
  updateApproval(
    @Param('id') id: string,
    @Req() req: { user: { name: string; email: string } },
    @Body() dto: UpdateStudentApprovalDto,
  ) {
    const approvedBy = dto.approvedBy || `${req.user.name} (${req.user.email})`;
    return this.usersService.updateApproval(id, dto.status, approvedBy);
  }

  @Get('students/:id/roommate-suggestions')
  suggestions(@Param('id') id: string) {
    return this.usersService.getRoommateSuggestions(id);
  }
}
