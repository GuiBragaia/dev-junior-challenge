import { Body, Controller, Get, Post } from '@nestjs/common';
import { CriarCheckinDto } from './dto/criar-checkin.dto';
import { CheckinService } from './checkin.service';

@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  criar(@Body() body: CriarCheckinDto) {
    return this.checkinService.criar(body.cpf);
  }

  @Get()
  listar() {
    return this.checkinService.listarDoDia();
  }
}
