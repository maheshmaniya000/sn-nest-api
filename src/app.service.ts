import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly message = 'Hello World!';

  getHello(): string {
    return this.message;
  }
}
