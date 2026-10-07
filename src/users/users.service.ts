import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RedisService } from 'src/redis/redis.service';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { NOT_FOUND_MESSAGE_BY_ID } from 'src/common/constants/messages';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserSearchDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly configService: ConfigService,

    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = Number(
      this.configService.get('BCRYPT_SALT_ROUNDS', '10'),
    );

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
      withDeleted: true,
    });

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const user = this.usersRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['roles'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('User', id));
    }

    return user;
  }

  async findOneWithData(id: string, query: UserSearchDto): Promise<User> {
    const relations: string[] = ['roles'];

    if (query.permissions) {
      relations.push('roles.permissions');
    }

    if (query.posts || query.postId) {
      relations.push('posts');
    }

    if (query.comments) {
      relations.push('posts.comments');
    }

    if (query.commentAuthors) {
      relations.push('posts.comments.author');
    }

    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('User', id));
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('User', id));
    }

    const updateData: Partial<User> = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      const saltRounds = Number(
        this.configService.get('BCRYPT_SALT_ROUNDS', '10'),
      );

      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    Object.assign(user, updateData);

    const updatedUser = await this.usersRepository.save(user);

    await this.redisService.set(
      `user:profile:${updatedUser.id}`,
      updatedUser,
      300,
    );

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('User', id));
    }
  }

  async getProfile(id: string): Promise<User> {
    const cacheKey = `user:profile:${id}`;

    const cachedUser = await this.redisService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('User', id));
    }

    await this.redisService.set(cacheKey, user, 300);

    return user;
  }
}
