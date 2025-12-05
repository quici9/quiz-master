import { Controller, Patch, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Patch('profile')
  async updateProfile(@User() user, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('password')
  async changePassword(@User() user, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }
  @Get('preferences')
  async getPreferences(@User() user) {
    return this.usersService.getPreferences(user.id);
  }

  @Patch('preferences')
  async updatePreferences(@User() user, @Body() dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(user.id, dto);
  }
}
