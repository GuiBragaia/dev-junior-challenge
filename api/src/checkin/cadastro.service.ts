import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type Paciente = {
  cpf: string;
  nome: string;
};

@Injectable()
export class CadastroService {
  async buscarPorCpf(cpf: string): Promise<Paciente> {
    const base = process.env.CADASTRO_URL || 'http://localhost:4000';

    let resposta: Response;
    try {
      resposta = await fetch(`${base}/pacientes/${cpf}`);
    } catch {
      throw new BadGatewayException(
        'Não foi possível consultar o cadastro de pacientes',
      );
    }

    if (resposta.status === 404) {
      throw new NotFoundException(
        'Paciente não encontrado para o CPF informado',
      );
    }

    if (!resposta.ok) {
      throw new BadGatewayException('Cadastro de pacientes retornou um erro');
    }

    const dados = (await resposta.json()) as Paciente;
    return { cpf: dados.cpf, nome: dados.nome };
  }
}
