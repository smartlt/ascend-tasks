import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

export interface FindAllUsersParams {
  q?: string;
  start?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000 || error.name === 'MongoServerError') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(
    params: FindAllUsersParams = {},
  ): Promise<{ users: User[]; total: number }> {
    const { q, start = 0, limit = 10 } = params;

    // Build search query
    const searchQuery: Record<string, any> = {};
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.userModel.countDocuments(searchQuery);

    // Get users with pagination
    const users = await this.userModel
      .find(searchQuery)
      .skip(start)
      .limit(limit)
      .exec();

    return { users, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000 || error.name === 'MongoServerError') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, message: 'User deleted successfully' };
    } catch {
      return { success: false, message: 'Failed to delete user' };
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email, isActive: true }).exec();
  }

  async count(): Promise<number> {
    return await this.userModel.countDocuments({ isActive: true }).exec();
  }
}
