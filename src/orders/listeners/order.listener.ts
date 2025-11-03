import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order.created.event';

@Injectable()
export class OrderListener {
  @OnEvent('order.created', { async: true })
  async handleOrderCreated(event: OrderCreatedEvent) {
    console.log(`[Subscriber] Iniciando procesamiento de orden ${event.orderId}...`);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log(`[Subscriber] Nueva orden creada: ID ${event.orderId}, Cliente ${event.clientId}, Total: $${event.totalAmount}`);
    console.log(`[Subscriber] Procesamiento completado para orden ${event.orderId}`);
  }
}

