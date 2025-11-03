import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderCreatedEvent } from './events/order.created.event';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.ordersRepository.save(createOrderDto);
    console.log(`[Publisher] Orden ${order.id} guardada en BD, publicando evento...`);
    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(
        order.id,
        order.clientId,
        order.totalAmount,
      ),
    );
    console.log(`[Publisher] Evento publicado, respondiendo al cliente inmediatamente`);
    return order;
  }

  findAll() {
    return this.ordersRepository.find();
  }

  findOne(id: number) {
    return this.ordersRepository.findOneBy({ id });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.ordersRepository.delete(id);
  }
}
