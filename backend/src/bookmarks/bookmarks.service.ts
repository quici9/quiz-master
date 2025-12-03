import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: string, questionId: string, note?: string) {
    // Check if question exists
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check if already bookmarked
    const existing = await this.prisma.questionBookmark.findUnique({
      where: {
        userId_questionId: { userId, questionId },
      },
    });

    if (existing) {
      throw new ConflictException('Question already bookmarked');
    }

    // Create bookmark
    const bookmark = await this.prisma.questionBookmark.create({
      data: { userId, questionId, note },
      include: {
        question: {
          include: {
            quiz: { select: { id: true, title: true } },
          },
        },
      },
    });

    return bookmark;
  }

  async removeBookmark(bookmarkId: string, userId: string) {
    const bookmark = await this.prisma.questionBookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException('Not your bookmark');
    }

    await this.prisma.questionBookmark.delete({
      where: { id: bookmarkId },
    });

    return { message: 'Bookmark removed successfully' };
  }

  async getMyBookmarks(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.questionBookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          question: {
            include: {
              quiz: { select: { id: true, title: true } },
              options: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.questionBookmark.count({ where: { userId } }),
    ]);

    return {
      bookmarks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

