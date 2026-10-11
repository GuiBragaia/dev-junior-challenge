import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinModule } from './checkin/checkin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgres://desafio:desafio@localhost:5432/checkin',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 2000,
    }),
    CheckinModule,
  ],
})
export class AppModule {}
