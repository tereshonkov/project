import { Body, Controller, Post, Param, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':userId/pdf')
  async getPdfReport(
    @Param('userId') userId: string,
    @Body('date') date: string[],
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportService.generatePdf(userId, date);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report_${userId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  }
}
