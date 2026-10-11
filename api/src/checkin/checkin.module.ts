import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CadastroService } from './cadastro.service';
import { Checkin } from './checkin.entity';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin])],
  controllers: [CheckinController],
  providers: [CheckinService, CadastroService],
})
export class CheckinModule {}
