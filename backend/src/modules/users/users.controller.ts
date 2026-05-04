import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { UpdateRoleDto } from './dto/update-role.dto.js';

/**
 * UsersController — REST endpoints for user management.
 *
 * All routes are protected by ClerkAuthGuard (global).
 * Admin routes additionally use @Roles('admin') + RolesGuard.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* ── Authenticated user endpoints ── */

  @Get('me')
  getMe(@CurrentUser() user: { clerkId: string }) {
    return this.usersService.getMe(user.clerkId);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: { clerkId: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.clerkId, dto);
  }

  /* ── Admin-only endpoints ── */

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }
}
