import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolesService } from './roles.service';
import { ROLES_MESSAGES } from 'src/common/constants/messages';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto);

    return {
      success: true,
      message: ROLES_MESSAGES.CREATED,
      data: result,
    };
  }
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.rolesService.findAll(paginationDto);

    return {
      success: true,
      message: ROLES_MESSAGES.RETRIEVED,
      data: result,
    };
  }
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.rolesService.findOne(id);

    return {
      success: true,
      message: ROLES_MESSAGES.RETRIEVED,
      data: result,
    };
  }
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.rolesService.update(id, updateRoleDto);

    return {
      success: true,
      message: ROLES_MESSAGES.UPDATED,
      data: result,
    };
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.rolesService.remove(id);

    return {
      success: true,
      message: ROLES_MESSAGES.DELETED,
      data: null,
    };
  }
}
