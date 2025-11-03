import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[];

  @IsNumber()
  totalAmount: number;
}
