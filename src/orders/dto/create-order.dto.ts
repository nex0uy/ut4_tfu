import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsNumber({}, { each: true })
  productIds: number[];
}
