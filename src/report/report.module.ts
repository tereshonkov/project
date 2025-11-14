import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PressureService } from 'src/pressure/pressure.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PrismaService, PressureService],
})
export class ReportModule {}
