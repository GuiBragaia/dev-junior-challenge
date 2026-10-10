import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CadastroService } from './cadastro.service';
import { CheckinService } from './checkin.service';

describe('CheckinService', () => {
  let service: CheckinService;
  let cadastro: { buscarPorCpf: jest.Mock };

  beforeEach(async () => {
    cadastro = { buscarPorCpf: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: CadastroService, useValue: cadastro },
      ],
    }).compile();

    service = module.get(CheckinService);
  });

  it('registra o check-in com o nome vindo do cadastro', async () => {
    cadastro.buscarPorCpf.mockResolvedValue({
      cpf: '11111111111',
      nome: 'Ana Souza',
    });

    const checkin = await service.criar('111.111.111-11');

    expect(cadastro.buscarPorCpf).toHaveBeenCalledWith('11111111111');
    expect(checkin.cpf).toBe('11111111111');
    expect(checkin.nome).toBe('Ana Souza');
    expect(service.listarDoDia()).toEqual([checkin]);
  });

  it('recusa cpf incompleto sem consultar o cadastro', async () => {
    await expect(service.criar('123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(cadastro.buscarPorCpf).not.toHaveBeenCalled();
  });

  it('nao coloca na fila quando o paciente nao existe', async () => {
    cadastro.buscarPorCpf.mockRejectedValue(
      new NotFoundException('Paciente não encontrado para o CPF informado'),
    );

    await expect(service.criar('99999999999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(service.listarDoDia()).toEqual([]);
  });
});
