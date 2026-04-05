import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type SortBy = 'course' | 'sports' | 'career' | 'approval';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listStudents(
    sortBy: SortBy = 'course',
    approvalStatus?: ApprovalStatus,
  ) {
    const students = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        ...(approvalStatus ? { approvalStatus } : {}),
      },
      include: {
        allocation: {
          include: {
            room: true,
          },
        },
      },
      orderBy: [{ approvalStatus: 'asc' }, { name: 'asc' }],
    });

    return students.sort((left, right) => {
      if (sortBy === 'sports') {
        return (left.sportsInterests[0] || '').localeCompare(
          right.sportsInterests[0] || '',
        );
      }
      if (sortBy === 'career') {
        return (left.careerGoal || '').localeCompare(right.careerGoal || '');
      }
      if (sortBy === 'approval') {
        return left.approvalStatus.localeCompare(right.approvalStatus);
      }

      return (left.course || '').localeCompare(right.course || '');
    });
  }

  async updateApproval(
    studentId: string,
    status: ApprovalStatus,
    approvedBy?: string,
  ) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.user.update({
      where: { id: studentId },
      data: {
        approvalStatus: status,
        approvedAt: status === 'APPROVED' ? new Date() : null,
        approvedBy: approvedBy || null,
      },
    });
  }

  async getRoommateSuggestions(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Student not found');
    }

    const candidates = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        id: { not: studentId },
        approvalStatus: 'APPROVED',
      },
      include: {
        allocation: {
          include: { room: true },
        },
      },
    });

    return candidates
      .map((candidate) => {
        let score = 0;
        const reasons: string[] = [];

        if (candidate.course && candidate.course === student.course) {
          score += 3;
          reasons.push('same course');
        }

        if (candidate.gender && candidate.gender === student.gender) {
          score += 2;
          reasons.push('same gender');
        }

        const commonSports = candidate.sportsInterests.filter((sport) =>
          student.sportsInterests.includes(sport),
        );
        if (commonSports.length > 0) {
          score += commonSports.length * 2;
          reasons.push(`shared sports: ${commonSports.join(', ')}`);
        }

        if (
          candidate.careerGoal &&
          student.careerGoal &&
          candidate.careerGoal.toLowerCase() ===
            student.careerGoal.toLowerCase()
        ) {
          score += 2;
          reasons.push('same career goal');
        }

        return {
          id: candidate.id,
          name: candidate.name,
          enrollmentNo: candidate.enrollmentNo,
          course: candidate.course,
          gender: candidate.gender,
          sportsInterests: candidate.sportsInterests,
          careerGoal: candidate.careerGoal,
          phone: candidate.phone,
          avatarUrl: candidate.avatarUrl,
          allocation: candidate.allocation,
          score,
          reasons,
        };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);
  }
}
