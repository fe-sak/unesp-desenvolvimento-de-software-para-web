## Requisitos

- Docker e Docker Compose
- Node.js 20+

## Inicio Rapido

Copie `.env.example` para `.env` e defina `APP_JWT_SECRET`.

### So backend (Docker)
```bash
cp .env.example .env
make up
```

### Backend + frontend (dev)
```bash
cp .env.example .env
make dev-all
```

O backend sobe em `http://localhost:8080` e o frontend em `http://localhost:3000`.

### Comandos make
```bash
make dev          # so backend docker (dev)
make dev-all      # backend docker + frontend vite
make down         # derruba containers
make clean-db     # derruba e apaga banco (reset)
make clean-locks  # limpa locks do gradle
make test         # testes do backend
make fe-dev       # so frontend
make fe-build     # build de producao do frontend
```

### Dados iniciais (seed)

Na primeira subida com o banco vazio, dados de exemplo sao criados automaticamente. Para desabilitar, defina `APP_SEED_ENABLED=false` no `.env`.

| Login | Senha | Role | Vinculo |
|-------|-------|------|---------|
| admin | admin | ADMIN | - |
| carlos | 123 | TECNICO | Carlos Eletronica |
| joao | 123 | USER | Joao Silva |

## Dominio

### Entidades
| Entidade | Tabela | Descricao |
|----------|--------|-----------|
| Cliente | cliente | nome, telefone, email |
| Tecnico | tecnico | nome, especialidade |
| Aparelho | aparelho | tipo, marca, modelo, defeito, cliente |
| Servico | servico | data, hora, status, obs, cliente, tecnico, aparelho |
| User | users | username, senha, role, cliente, tecnico |

### Roles
| Role | Vinculo | Acesso |
|------|---------|--------|
| ADMIN | nenhum | tudo (CRUD clientes, tecnicos, aparelhos, servicos) |
| TECNICO | User -> Tecnico | seus servicos, kanban, aparelhos |
| USER | User -> Cliente | seus aparelhos, timeline, solicitar reparo |

### Status do servico
```
PENDENTE -> CONFIRMADO -> EM_ANDAMENTO -> CONCLUIDO
    |            |              |
    +------------+--------------+--> CANCELADO
```

## UML
```
@startuml
skinparam classAttributeIconSize 0

class User {
  +Long id
  +String username
  +String password
  +String name
  +UserRole role
}

class Cliente {
  +Long id
  +String nome
  +String telefone
  +String email
}

class Tecnico {
  +Long id
  +String nome
  +String especialidade
}

class Aparelho {
  +Long id
  +String tipo
  +String marca
  +String modelo
  +String defeitoRelatado
}

class Servico {
  +Long id
  +LocalDate data
  +LocalTime hora
  +StatusServico status
  +String observacao
}

enum StatusServico {
  PENDENTE
  CONFIRMADO
  EM_ANDAMENTO
  CANCELADO
  CONCLUIDO
}

enum UserRole {
  USER
  TECNICO
  ADMIN
}

Cliente "1" -- "0..*" Aparelho
Cliente "1" -- "0..*" Servico
Tecnico "1" -- "0..*" Servico
Aparelho "1" -- "0..*" Servico
Servico --> StatusServico
User --> UserRole
User "0..1" -- "1" Cliente
User "0..1" -- "1" Tecnico

@enduml
```

## API

### Autenticacao (publica)
```
POST /auth/register   { username, password, name?, admin?, clienteId?, tecnicoId? }
POST /auth/login      { username, password }
```

### Clientes (ADMIN)
```
GET    /clientes/
GET    /clientes/{id}
POST   /clientes/
PUT    /clientes/
DELETE /clientes/{id}
```

### Tecnicos (GET publico, resto ADMIN)
```
GET    /tecnicos/
GET    /tecnicos/{id}
POST   /tecnicos/
PUT    /tecnicos/
DELETE /tecnicos/{id}
```

### Aparelhos (ADMIN, TECNICO, USER)
```
GET    /aparelhos/
GET    /aparelhos/{id}
POST   /aparelhos/
PUT    /aparelhos/
DELETE /aparelhos/{id}
```

### Servicos (ADMIN, TECNICO, USER)
```
GET    /servicos/
GET    /servicos/{id}
POST   /servicos/
PUT    /servicos/
DELETE /servicos/{id}
```

## Funcionalidades

- Registro com escolha de role (admin, cliente, tecnico)
- Wizard de 4 passos para criar servico (cliente -> aparelho -> tecnico -> detalhes)
- Quadro kanban com drag and drop para mudar status
- Botao aceitar para tecnicos assumirem servicos pendentes
- Dashboard do cliente com timeline de status por aparelho
- Solicitacao de reparo pelo cliente (aparelho novo ou existente)
- Exclusao de servicos restrita ao admin
