import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ALREADY_EXISTS,
  NOT_FOUND_MESSAGE_BY_ID,
  PERMISSION_MESSAGES,
} from 'src/common/constants/messages';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionsRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existing) {
      throw new ConflictException(ALREADY_EXISTS('Permission'));
    }

    const result = this.permissionsRepository.create({
      ...createPermissionDto,
    });

    return this.permissionsRepository.save(result);
  }
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [permissions, total] = await this.permissionsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      permissions,
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
  async findOne(id: string): Promise<Permission> {
    const result = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('Permission', id));
    }

    return result;
  }
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const result = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(PERMISSION_MESSAGES.NOT_FOUND);
    }

    Object.assign(result, updatePermissionDto);

    return this.permissionsRepository.save(result);
  }
  @Delete(':id')
  async remove(id: string): Promise<void> {
    const result = await this.permissionsRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('Permission', id));
    }
  }
}
