import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PressureService } from '../pressure/pressure.service';
import { groupByDay } from './utils/groupDayFunc';
import PdfPrinter = require('pdfmake'); // PdfPrinter для Node
import * as path from 'path';

type PressureRecord = {
  id: string;
  userId: string;
  pressure: string;
  pulse: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pressureService: PressureService,
  ) {}

  async generatePdf(userId: string, date: string[]): Promise<Buffer> {
    const dates: PressureRecord[] = [];

    for (const day of date) {
      const pressureRecords =
        await this.pressureService.getPressureRecordByDate({
          userId,
          date: day,
        });
      dates.push(...pressureRecords);
    }

    const groupedRecords = groupByDay(dates);

    console.log('Pressure records for PDF:', dates);
    console.log('Grouped records:', groupedRecords);
    console.log('Requested dates:', date);

    const fonts = {
      Roboto: {
        normal: path.join(process.cwd(), 'fonts/Roboto-Regular.ttf'),
        bold: path.join(process.cwd(), 'fonts/Roboto-Medium.ttf'),
        italics: path.join(process.cwd(), 'fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(process.cwd(), 'fonts/Roboto-MediumItalic.ttf'),
      },
    };

    const printer = new PdfPrinter(fonts);

    const body = [
      [
        'Дата',
        'Утренний пульс',
        'Утреннее давление',
        'Вечерний пульс',
        'Вечернее давление',
      ],
    ];

    groupedRecords.forEach((record) => {
      // Склеиваем все утренние измерения через запятую
      const morningPulse =
        (record.morning ?? []).map((m) => m.pulse).join(', ') || '-';
      const morningPressure =
        (record.morning ?? []).map((m) => m.pressure).join(', ') || '—';

      const eveningPulse =
        (record.evening ?? []).map((m) => m.pulse).join(', ') || '-';
      const eveningPressure =
        (record.evening ?? []).map((m) => m.pressure).join(', ') || '—';

      body.push([
        record.date,
        morningPulse,
        morningPressure,
        eveningPulse,
        eveningPressure,
      ]);
    });

    const docDefinition = {
      defaultStyle: { font: 'Roboto' },
      content: [
        {
          text: 'Отчет по давлению Терешонкова Маргарита Валериевна',
          style: 'header',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    });
  }
}
