import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CadastroService } from './cadastro.service';
import { Checkin } from './checkin.entity';
import { CheckinService } from './checkin.service';

describe('CheckinService', () => {
  let service: CheckinService;
  let cadastro: { buscarPorCpf: jest.Mock };
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    cadastro = { buscarPorCpf: jest.fn() };
    repo = {
      create: jest.fn((dados: Partial<Checkin>) => dados),
      save: jest.fn((dados: Partial<Checkin>) =>
        Promise.resolve({
          id: '1',
          chegadaEm: new Date(),
          ...dados,
        }),
      ),
      find: jest.fn(() => Promise.resolve([])),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: CadastroService, useValue: cadastro },
        { provide: getRepositoryToken(Checkin), useValue: repo },
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
    repo.find.mockResolvedValue([checkin]);

    expect(cadastro.buscarPorCpf).toHaveBeenCalledWith('11111111111');
    expect(checkin.cpf).toBe('11111111111');
    expect(checkin.nome).toBe('Ana Souza');
    await expect(service.listarDoDia()).resolves.toEqual([checkin]);
  });

  it('recusa cpf incompleto sem consultar o cadastro', async () => {
    await expect(service.criar('123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(cadastro.buscarPorCpf).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('nao coloca na fila quando o paciente nao existe', async () => {
    cadastro.buscarPorCpf.mockRejectedValue(
      new NotFoundException('Paciente não encontrado para o CPF informado'),
    );

    await expect(service.criar('99999999999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.save).not.toHaveBeenCalled();
    await expect(service.listarDoDia()).resolves.toEqual([]);
  });
});
