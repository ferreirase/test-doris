import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface IProductCreated {
  id: number;
  image_url: string;
}

@Injectable()
export class AppService {
  @EventPattern('product_created')
  getMessages(@Payload() data: IProductCreated[]): void {
    console.log(data);
  }
}
