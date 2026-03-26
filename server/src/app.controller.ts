import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'Hostel Management Platform API',
      version: 'v1',
      status: 'ok',
    };
  }
}
