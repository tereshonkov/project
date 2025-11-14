import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: UserDto) {
    const { email, password } = dto;
    // eslint-disable-next-line
    return await this.prismaService.user.create({
      data: {
        email,
        password,
      },
    });
  }
}
