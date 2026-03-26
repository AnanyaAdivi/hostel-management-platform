import { BadRequestException, Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Injectable()
export class AnonymousService {
  private readonly anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateComplaintDto, userId: string) {
    if (dto.imageUrl) {
      const isValid = await this.validateImage(dto.imageUrl);
      if (!isValid) {
        throw new BadRequestException(
          'Image does not appear to show a hostel maintenance or facility issue. Please upload a relevant photo.',
        );
      }
    }

    const complaint = await this.prisma.complaint.create({
      data: {
        isAnonymous: true,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        status: 'PENDING',
      },
    });

    const studentHash = crypto
      .createHash('sha256')
      .update(userId + (process.env.HASH_SALT || 'default-salt'))
      .digest('hex');

    await this.prisma.complaintIdentity.create({
      data: { complaintId: complaint.id, studentHash },
    });

    return {
      token: complaint.token,
      message:
        'Your complaint has been submitted anonymously. Save this token to track your complaint.',
    };
  }

  async track(token: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { token },
      select: {
        token: true,
        category: true,
        title: true,
        description: true,
        status: true,
        adminNote: true,
        createdAt: true,
        resolvedAt: true,
        updatedAt: true,
      },
    });

    if (!complaint) {
      throw new BadRequestException('Invalid token. No complaint found.');
    }

    return complaint;
  }

  async publicTrack(token: string) {
    return this.track(token);
  }

  private async validateImage(imageUrl: string): Promise<boolean> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 20,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'url', url: imageUrl },
              },
              {
                type: 'text',
                text: 'Does this image show a hostel maintenance issue, cleanliness problem, infrastructure damage, broken furniture, plumbing issue, or any facility concern in a residential building? Reply only YES or NO.',
              },
            ],
          } as any,
        ],
      });

      const answer = (
        response.content[0] as {
          text?: string;
        }
      ).text
        ?.trim()
        .toUpperCase();

      return answer === 'YES';
    } catch (error) {
      console.error('Image validation error:', error);
      return true;
    }
  }
}
