import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type IntentType = 'LIVE_DATA' | 'HOSTEL_FAQ' | 'COMPLAINT_ACTION' | 'GENERAL';

@Injectable()
export class ChatbotService {
  private readonly anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  constructor(private readonly prisma: PrismaService) {}

  async chat(message: string, userId: string, history: ChatMessage[] = []) {
    const intent = this.classifyIntent(message);
    let contextData = '';

    if (intent === 'LIVE_DATA') {
      contextData = await this.getLiveData(userId);
    } else if (intent === 'HOSTEL_FAQ') {
      contextData = await this.searchKnowledgeBase(message);
    } else if (intent === 'COMPLAINT_ACTION') {
      contextData = await this.getComplaintContext(userId);
    }

    const systemPrompt = `You are HostelBot, a friendly and helpful AI assistant for ${
      process.env.HOSTEL_NAME || 'SAU International Hostel'
    } at South Asian University, New Delhi.

You help students with:
- Room information and allocation queries
- Hostel rules, facilities, and timings
- How to file complaints and track them
- Maintenance requests and schedules
- General campus and hostel life queries

Guidelines:
- Be warm, concise, and helpful
- If you don't know something, suggest contacting the warden at warden@sau.ac.in
- For urgent issues, suggest calling the warden's office
- Format responses clearly, use bullet points for lists
- Keep responses under 150 words unless detailed info is needed${
      contextData ? `\nRelevant context:\n${contextData}` : ''
    }`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        ...history.slice(-6).map((item) => ({
          role: item.role,
          content: item.content,
        })),
        { role: 'user', content: message },
      ],
    });

    return {
      message: (response.content[0] as { text?: string }).text ?? '',
      intent,
    };
  }

  private classifyIntent(message: string): IntentType {
    const lower = message.toLowerCase();
    const liveDataKeywords = [
      'my room',
      'my allocation',
      'my dues',
      'my fee',
      'which room',
      'am i allocated',
      'my block',
      'my floor',
    ];
    const faqKeywords = [
      'timing',
      'rule',
      'facility',
      'wifi',
      'mess',
      'laundry',
      'guest',
      'gate',
      'curfew',
      'fee structure',
      'how much',
      'when does',
    ];
    const complaintKeywords = [
      'complaint',
      'complain',
      'issue',
      'problem',
      'broken',
      'not working',
      'report',
    ];

    if (liveDataKeywords.some((keyword) => lower.includes(keyword))) {
      return 'LIVE_DATA';
    }
    if (faqKeywords.some((keyword) => lower.includes(keyword))) {
      return 'HOSTEL_FAQ';
    }
    if (complaintKeywords.some((keyword) => lower.includes(keyword))) {
      return 'COMPLAINT_ACTION';
    }
    return 'GENERAL';
  }

  private async getLiveData(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        allocation: {
          include: { room: true },
        },
      },
    });

    if (!user) {
      return 'Student data not found.';
    }

    if (!user.allocation || !user.allocation.isActive) {
      return `Student ${user.name} does not have an active room allocation.`;
    }

    const room = user.allocation.room;
    return `Student: ${user.name}. Room: ${room.number}, Block ${room.block}, Floor ${room.floor}. Amenities: ${room.amenities.join(', ')}.`;
  }

  private async searchKnowledgeBase(query: string): Promise<string> {
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const entries = await this.prisma.knowledgeBase.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    const relevant = entries.filter((entry) =>
      keywords.some((keyword) => entry.content.toLowerCase().includes(keyword)),
    );

    if (relevant.length === 0) {
      return entries
        .slice(0, 2)
        .map((entry) => entry.content)
        .join('\n\n');
    }

    return relevant.map((entry) => entry.content).join('\n\n');
  }

  private async getComplaintContext(userId: string): Promise<string> {
    const recent = await this.prisma.complaint.findMany({
      where: { userId, isAnonymous: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { token: true, title: true, status: true, category: true },
    });

    if (recent.length === 0) {
      return 'No recent complaints found for this student.';
    }

    return `Recent complaints:\n${recent
      .map(
        (complaint) =>
          `- ${complaint.title} (${complaint.category}): ${complaint.status} [Token: ${complaint.token}]`,
      )
      .join('\n')}`;
  }
}
