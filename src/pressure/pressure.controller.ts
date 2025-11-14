import { Controller, Get, Param } from '@nestjs/common';
import { PressureService } from './pressure.service';

@Controller('pressure')
export class PressureController {
  constructor(private readonly pressureService: PressureService) {}

  @Get(':userId/all-records')
  async getAllPressureRecords(@Param('userId') userId: string): Promise<any> {
    return this.pressureService.getAllPressureRecords({ userId });
  }
}
