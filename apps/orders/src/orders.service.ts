import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './order.repository';
import { BILLING_SERVICE } from './constant/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(private readonly ordersRepository: OrdersRepository, @Inject(BILLING_SERVICE) private billingClient: ClientProxy) {}

  async getOrder() {
    return this.ordersRepository.find({});
  }

  async createOrder(request: CreateOrderRequest) {
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(this.billingClient.emit('order_created', { request }));
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
