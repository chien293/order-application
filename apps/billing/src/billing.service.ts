import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  getHello(): string {
    return 'Hello World!';
  }

  handleOrderCreated(data: any) {
    this.logger.log(data, " Billing ");
    console.log("consolelog")
  }
}
