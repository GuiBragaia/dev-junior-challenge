import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CadastroService } from './cadastro.service';
import { Checkin } from './checkin.entity';

@Injectable()
export class CheckinService {
  constructor(
    private readonly cadastro: CadastroService,
    @InjectRepository(Checkin)
    private readonly checkins: Repository<Checkin>,
  ) {}

  async criar(cpfInformado: string): Promise<Checkin> {
    const cpf = cpfInformado.replace(/\D/g, '');

    if (cpf.length !== 11) {
      throw new BadRequestException('CPF deve ter 11 dígitos');
    }

    const paciente = await this.cadastro.buscarPorCpf(cpf);

    const checkin = this.checkins.create({
      cpf,
      nome: paciente.nome,
    });

    return this.checkins.save(checkin);
  }

  listarDoDia(): Promise<Checkin[]> {
    const inicio = inicioDoDiaEmSaoPaulo();
    const fim = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);

    return this.checkins.find({
      where: { chegadaEm: Between(inicio, fim) },
      order: { chegadaEm: 'ASC' },
    });
  }
}

// São Paulo fica em UTC-3 o ano inteiro.
function inicioDoDiaEmSaoPaulo(agora = new Date()): Date {
  const dia = agora.toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
  return new Date(`${dia}T00:00:00-03:00`);
}
