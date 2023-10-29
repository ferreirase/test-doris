import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

interface IProductCreated {
  id: number;
  image_url: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('product_created')
  getMessages(@Payload() data: IProductCreated[]): void {
    console.log(data);
  }
}
