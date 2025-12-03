import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { User } from '../common/decorators/user.decorator';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  async createBookmark(
    @User() user,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(user.id, dto.questionId, dto.note);
  }

  @Delete(':id')
  async removeBookmark(@Param('id') id: string, @User() user) {
    return this.bookmarksService.removeBookmark(id, user.id);
  }

  @Get('my')
  async getMyBookmarks(
    @User() user,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.bookmarksService.getMyBookmarks(user.id, +page, +limit);
  }
}

