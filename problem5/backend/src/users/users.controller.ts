import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService, FindAllUsersParams } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with name, age, email, and optional avatarUrl. Email must be unique.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users with search and pagination',
    description:
      'Returns a paginated list of users. Supports search by name or email.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for name or email',
    example: 'john',
  })
  @ApiQuery({
    name: 'start',
    required: false,
    description: 'Starting index for pagination',
    example: 0,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination info',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/User' },
        },
        total: { type: 'number', example: 25 },
        start: { type: 'number', example: 0 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(
    @Query('q') q?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
  ): Promise<{ users: User[]; total: number; start: number; limit: number }> {
    const params: FindAllUsersParams = {
      q,
      start: start ? parseInt(start, 10) : 0,
      limit: limit ? parseInt(limit, 10) : 10,
    };

    const result = await this.usersService.findAll(params);

    return {
      ...result,
      start: params.start || 0,
      limit: params.limit || 10,
    };
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns detailed information about a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @Put(':userId')
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Updates user information. All fields are optional.',
  })
  @ApiParam({
    name: 'userId',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Permanently deletes a user from the database.',
  })
  @ApiParam({
    name: 'userId',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User deletion result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(
    @Param('userId') userId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.usersService.remove(userId);
  }
}
