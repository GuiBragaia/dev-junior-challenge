import { Module } from '@nestjs/common';
import { CadastroService } from './cadastro.service';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';

@Module({
  controllers: [CheckinController],
  providers: [CheckinService, CadastroService],
})
export class CheckinModule {}
