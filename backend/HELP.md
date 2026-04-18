# Guia do Backend

## Docker

O fluxo com Docker Compose fica na raiz do repositório e sobe o backend junto
com o Postgres.

Antes de usar, crie um arquivo `.env` na raiz do repositório a partir de
`.env.example` e defina um `APP_JWT_SECRET` real.

Fluxo empacotado, a partir da raiz do repositório:

```bash
cp .env.example .env
make up
```

Fluxo de desenvolvimento, com o código do backend montado no contêiner:

```bash
cp .env.example .env
make dev
```

O override de desenvolvimento executa `./gradlew bootRun --continuous` dentro
do contêiner e mantém o cache do Gradle em um volume nomeado do Docker.

## Testes

`make test` usa `./gradlew test` com um banco H2 em memória configurado em
`src/test/resources/application.properties`.

## Build e imagem

Use `make build` para gerar o build local do backend com o Gradle wrapper.

Use `make image` para gerar apenas a imagem Docker da aplicação.
