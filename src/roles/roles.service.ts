import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import {
  ALREADY_EXISTS,
  NOT_FOUND_MESSAGE_BY_ID,
  ROLES_MESSAGES,
} from 'src/common/constants/messages';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existing) {
      throw new ConflictException(ALREADY_EXISTS('Role'));
    }

    const result = this.rolesRepository.create({
      ...createRoleDto,
    });

    return this.rolesRepository.save(result);
  }
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [results, total] = await this.rolesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results,
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
  async findOne(id: string): Promise<Role> {
    const result = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('Role', id));
    }

    return result;
  }
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const result = await this.rolesRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(ROLES_MESSAGES.NOT_FOUND);
    }

    Object.assign(result, updateRoleDto);

    return this.rolesRepository.save(result);
  }
  @Delete(':id')
  async remove(id: string): Promise<void> {
    const result = await this.rolesRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(NOT_FOUND_MESSAGE_BY_ID('Role', id));
    }
  }
}
