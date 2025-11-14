import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePressureDto } from './dto/dto.pressure';

@Injectable()
export class PressureService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPressureRecord(dto: CreatePressureDto) {
    const { userId, pressure, pulse } = dto;
    // eslint-disable-next-line
    return await this.prismaService.pressure.create({
      data: {
        user: { connect: { id: userId } },
        pressure,
        pulse,
      },
    });
  }

  async getAllPressureRecords(dto: { userId: string }) {
    const { userId } = dto;
    // eslint-disable-next-line
    return await this.prismaService.pressure.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getPressureRecordByDate(dto: { userId: string; date: string }) {
    const { userId, date } = dto;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    // eslint-disable-next-line
    return await this.prismaService.pressure.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
