# Entrega — Guilherme Bragaia

## Como rodar

Precisa de Docker. Na raiz do projeto:

```bash
docker compose up --build
```

Quando os containers estiverem funcionando:

- tela: http://localhost:5173
- API: http://localhost:3000
- Cadastro (mock): http://localhost:4000
- Postgres, visto da máquina: `localhost:5433` (usuário, senha e banco: `desafio` / `desafio` / `checkin`)

A API, dentro da rede do compose, usa o banco em `db:5432`. A porta 5433 é só para acessar de fora. Deixei assim porque na minha máquina a 5432 já estava ocupada.

Para encerrar:

```bash
docker compose down
```

CPFs de teste, os mesmos do `mock-service`:

| CPF | Nome |
| --- | --- |
| 11111111111 | Ana Souza |
| 22222222222 | Bruno Carvalho |
| 33333333333 | Carla Menezes |
| 44444444444 | Diego Fernandes |
| 55555555555 | Elaine Rodrigues |

Pode digitar com ou sem máscara (`111.111.111-11`). Qualquer outro CPF de 11 dígitos volta "Paciente não encontrado" por padrao.

### Sem Docker

Dá para subir separado, se o Postgres já estiver rodando com esse usuário e esse banco.

```bash
cd mock-service && npm install && npm start
cd api && npm install && npm run start:dev
cd web && npm install && npm run dev
```

O mock fica na 4000, a API na 3000 e o front na 5173. Se o banco não estiver na 5432, exporta antes de subir a API:

```bash
export DATABASE_URL=postgres://desafio:desafio@localhost:5433/checkin
```

Os testes da API não precisam do banco nem do mock:

```bash
cd api && npm test
```

## O que foi feito

Fluxo de check-in de ponta a ponta.

- `POST /checkins` recebe o CPF, tira a pontuação, consulta o mock e grava a chegada.
- `GET /checkins` lista a fila de hoje, no horário de São Paulo, da mais antiga para a mais nova.
- CPF que não existe no cadastro responde 404 com uma mensagem clara. CPF que não tem 11 dígitos responde 400.
- Tela em React para informar o CPF, confirmar e ver a fila. Se a API recusar, a mensagem aparece na tela.
- Teste do serviço de check-in cobrindo o caso feliz, o CPF incompleto e o paciente que não existe.
- `docker compose up` sobe mock, banco, API e tela.

## Onde guardei os dados

No Postgres, tabela `checkins` (`id`, `cpf`, `nome`, `chegada_em`).

Comecei com a fila em memória para o fluxo funcionar logo. Passei para o banco porque a fila some quando a API reinicia, e o compose do desafio já trazia o Postgres. O TypeORM cria a tabela na subida (`synchronize`). Serve para este desafio. Em um sistema de verdade eu usaria migration.

## Decisões e dificuldades

A fila do dia usa o fuso de São Paulo. O container da API está em UTC, então comparar a data "crua" mudaria o dia perto da meia-noite.

Não validei o dígito do CPF. Os CPFs de teste do mock (tipo `11111111111`) não passariam nessa regra, e o enunciado pede para usar esses CPFs.

O front e a API ficam em portas diferentes, então precisei liberar CORS. Sem isso o navegador bloqueia a chamada.

O `npm ci` da imagem Linux falhou com o lock gerado no Mac. Atualizei o `package-lock.json` para os dois ficarem alinhados.

A API espera o Postgres ficar saudável antes de subir, e ainda tenta reconectar algumas vezes. Na primeira vez ela quebrava porque o banco ainda não estava aceitando conexão.

## O que faria com mais tempo

- Trocar o `synchronize` por migration.
- Impedir dois check-ins do mesmo CPF no mesmo dia.
- Atualizar a fila sozinha, sem precisar dar o check-in de novo para ver quem chegou.
- Um teste de ponta a ponta com o banco e o mock de verdade, além do teste unitário.
- Máscara de CPF no campo da tela.
