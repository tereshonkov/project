import { Module } from '@nestjs/common';
import { PressureService } from './pressure.service';
import { PressureController } from './pressure.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PressureController],
  providers: [PressureService, PrismaService],
  exports: [PressureService],
})
export class PressureModule {}
