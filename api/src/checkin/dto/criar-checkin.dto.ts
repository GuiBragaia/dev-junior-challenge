import { IsNotEmpty, IsString } from 'class-validator';

export class CriarCheckinDto {
  @IsString({ message: 'CPF deve ser um texto' })
  @IsNotEmpty({ message: 'Informe o CPF' })
  cpf: string;
}
