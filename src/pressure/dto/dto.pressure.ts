export class PressureDto {
  userId!: string;
  pressure!: number;
  pulse!: number;
  date!: string;
}

export class CreatePressureDto {
  userId!: string;
  pressure!: string;
  pulse!: number;
}
