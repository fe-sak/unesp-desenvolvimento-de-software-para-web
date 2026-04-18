## Início Rápido com Docker

Copie `.env.example` para `.env` na raiz do repositório e defina um
`APP_JWT_SECRET` real.

Para subir a aplicação empacotada com Postgres:

```bash
cp .env.example .env
make up
```

Para subir o fluxo de desenvolvimento com o backend montado no contêiner:

```bash
cp .env.example .env
make dev
```

Para executar os fluxos locais mais comuns:

```bash
make test
make build
make image
```

## UML
```
@startuml
skinparam classAttributeIconSize 0

class Cliente {
  +Long id
  +String nome
  +String telefone
  +String email
}

class Equipamento {
  +Long id
  +String tipo
  +String marca
  +String modelo
  +String defeitoRelatado
}

class Agendamento {
  +Long id
  +LocalDate data
  +LocalTime hora
  +StatusAgendamento status
  +String observacao
}

class Tecnico {
  +Long id
  +String nome
  +String especialidade
}

enum StatusAgendamento {
  PENDENTE
  CONFIRMADO
  CANCELADO
  CONCLUIDO
}

Cliente "1" -- "0..*" Equipamento
Cliente "1" -- "0..*" Agendamento
Equipamento "1" -- "0..*" Agendamento
Tecnico "1" -- "0..*" Agendamento
Agendamento --> StatusAgendamento

@enduml
```
