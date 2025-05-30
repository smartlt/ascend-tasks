import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    minimum: 1,
    maximum: 150,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(150)
  age: number;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @ValidateIf(
    (o: CreateUserDto) => o.avatarUrl != null && o.avatarUrl.trim() !== '',
  )
  @IsUrl()
  avatarUrl?: string;
}
