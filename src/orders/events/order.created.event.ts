export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly clientId: number,
    public readonly totalAmount: number,
  ) {}
}

