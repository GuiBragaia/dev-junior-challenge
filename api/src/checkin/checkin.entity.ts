import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('checkins')
export class Checkin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cpf: string;

  @Column()
  nome: string;

  @CreateDateColumn({ name: 'chegada_em', type: 'timestamptz' })
  chegadaEm: Date;
}
