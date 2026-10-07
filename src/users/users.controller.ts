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
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { USER_MESSAGES } from 'src/common/constants/messages';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      success: true,
      message: USER_MESSAGES.CREATED,
      data: user,
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.usersService.findAll(paginationDto);

    return {
      success: true,
      message: USER_MESSAGES.RETRIEVED,
      data: result,
    };
  }

  @Get('me')
  async getProfile(
    @Req() req: Request & { user: { id: string; email: string } },
  ) {
    const user = await this.usersService.getProfile(req.user.id);

    return {
      success: true,
      message: USER_MESSAGES.PROFILE,
      data: user,
    };
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findOne(id);

    return {
      success: true,
      message: USER_MESSAGES.RETRIEVED,
      data: user,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return {
      success: true,
      message: USER_MESSAGES.UPDATED,
      data: user,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.usersService.remove(id);

    return {
      success: true,
      message: USER_MESSAGES.DELETED,
      data: null,
    };
  }
}
