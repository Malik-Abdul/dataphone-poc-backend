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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PERMISSION_MESSAGES } from 'src/common/constants/messages';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.permissionsService.create(createPermissionDto);

    return {
      success: true,
      message: PERMISSION_MESSAGES.CREATED,
      data: result,
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.permissionsService.findAll(paginationDto);

    return {
      success: true,
      message: PERMISSION_MESSAGES.RETRIEVED,
      data: result,
    };
  }
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.permissionsService.findOne(id);

    return {
      success: true,
      message: PERMISSION_MESSAGES.RETRIEVED,
      data: result,
    };
  }
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const result = await this.permissionsService.update(
      id,
      updatePermissionDto,
    );

    return {
      success: true,
      message: PERMISSION_MESSAGES.UPDATED,
      data: result,
    };
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.permissionsService.remove(id);

    return {
      success: true,
      message: PERMISSION_MESSAGES.DELETED,
      data: null,
    };
  }
}
