import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PressureService } from '../pressure/pressure.service';
import { groupByDay } from './utils/groupDayFunc';
import PdfPrinter = require('pdfmake'); // PdfPrinter для Node

@Injectable()
export class ReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pressureService: PressureService,
  ) {}

  async generatePdf(userId: string, date: string): Promise<Buffer> {
    const pressureRecords = await this.pressureService.getPressureRecordByDate({
      userId,
      date,
    });

    const groupedRecords = groupByDay(pressureRecords);

    const fonts = {
      Roboto: {
        normal: 'node_modules/pdfmake/build/vfs_fonts.js', // временно можно оставить путь, PdfPrinter требует объект, ниже исправим
        bold: 'node_modules/pdfmake/build/vfs_fonts.js',
        italics: 'node_modules/pdfmake/build/vfs_fonts.js',
        bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js',
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
      body.push([
        record.date,
        record.morning ? String(record.morning.pulse) : '-',
        record.morning
          ? `${record.morning.systolic}/${record.morning.diastolic}`
          : '—',
        record.evening ? String(record.evening.pulse) : '-',
        record.evening
          ? `${record.evening.systolic}/${record.evening.diastolic}`
          : '—',
      ]);
    });

    const docDefinition = {
      content: [
        { text: 'Отчет по давлению за день', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body,
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
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
