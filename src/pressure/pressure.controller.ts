import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PressureService } from './pressure.service';
import { CreatePressureDto } from './dto/dto.pressure';

@Controller('pressure')
export class PressureController {
  constructor(private readonly pressureService: PressureService) {}

  @Get(':userId/all-records')
  async getAllPressureRecords(@Param('userId') userId: string): Promise<any> {
    return this.pressureService.getAllPressureRecords({ userId });
  }
  @Post('/create')
  async createPressureRecord(
    @Body() createPressureDto: CreatePressureDto,
  ): Promise<any> {
    return this.pressureService.createPressureRecord(createPressureDto);
  }
}
