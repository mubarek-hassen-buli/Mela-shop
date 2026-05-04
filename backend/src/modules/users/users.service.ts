import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { updateUserSchema, type UpdateUserDto } from './dto/update-user.dto.js';
import { updateRoleSchema, type UpdateRoleDto } from './dto/update-role.dto.js';
import type { User } from '../../database/schema/index.js';

/**
 * UsersService — business logic for user operations.
 * Validates input with Zod, delegates queries to UsersRepository.
 */
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  /** Get the current authenticated user's profile */
  async getMe(clerkId: string): Promise<User> {
    const user = await this.repo.findByClerkId(clerkId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Update the current user's profile */
  async updateMe(clerkId: string, dto: UpdateUserDto): Promise<User> {
    const parsed = updateUserSchema.parse(dto);
    const user = await this.repo.findByClerkId(clerkId);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.updateProfile(clerkId, parsed);
  }

  /** List all users (admin only) */
  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  /** Get a single user by ID (admin only) */
  async findById(id: number): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  /** Update a user's role (admin only) */
  async updateRole(id: number, dto: UpdateRoleDto): Promise<User> {
    const parsed = updateRoleSchema.parse(dto);
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.repo.updateRole(id, parsed.role);
  }

  /** Deactivate a user (admin only) */
  async deactivate(id: number): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    if (!user.isActive) throw new BadRequestException('User is already inactive');
    return this.repo.deactivate(id);
  }
}
