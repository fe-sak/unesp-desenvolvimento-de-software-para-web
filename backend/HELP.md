# Guia do Backend

## Docker

O fluxo com Docker Compose fica na raiz do repositório e sobe o backend junto
com o Postgres.

Antes de usar, crie um arquivo `.env` na raiz do repositório a partir de
`.env.example` e defina um `APP_JWT_SECRET` real.

Fluxo empacotado, a partir da raiz do repositório:

```bash
cp .env.example .env
docker compose up --build
```

Fluxo de desenvolvimento, com o código do backend montado no contêiner:

```bash
cp .env.example .env
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

O override de desenvolvimento executa `./gradlew bootRun --continuous` dentro
do contêiner e mantém o cache do Gradle em um volume nomeado do Docker.

## Testes

`./gradlew test` usa um banco H2 em memória configurado em
`src/test/resources/application.properties`.
