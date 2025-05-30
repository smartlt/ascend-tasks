import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id?: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @Prop({ required: true, type: Number })
  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    minimum: 1,
    maximum: 150,
  })
  age: number;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @Prop({ required: false })
  @ApiPropertyOptional({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
