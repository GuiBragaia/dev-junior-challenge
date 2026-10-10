import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CadastroService } from './cadastro.service';

export type Checkin = {
  id: string;
  cpf: string;
  nome: string;
  chegadaEm: string;
};

@Injectable()
export class CheckinService {
  private fila: Checkin[] = [];

  constructor(private readonly cadastro: CadastroService) {}

  async criar(cpfInformado: string): Promise<Checkin> {
    const cpf = cpfInformado.replace(/\D/g, '');

    if (cpf.length !== 11) {
      throw new BadRequestException('CPF deve ter 11 dígitos');
    }

    const paciente = await this.cadastro.buscarPorCpf(cpf);

    const checkin: Checkin = {
      id: randomUUID(),
      cpf,
      nome: paciente.nome,
      chegadaEm: new Date().toISOString(),
    };

    this.fila.push(checkin);
    return checkin;
  }

  listarDoDia(): Checkin[] {
    const hoje = diaEmSaoPaulo(new Date());

    return this.fila.filter(
      (item) => diaEmSaoPaulo(new Date(item.chegadaEm)) === hoje,
    );
  }
}

// en-CA devolve a data como aaaa-mm-dd
function diaEmSaoPaulo(data: Date): string {
  return data.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}
