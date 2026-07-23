SHELL := /bin/sh

.DEFAULT_GOAL := help

BACKEND_DIR := backend
GRADLE := cd $(BACKEND_DIR) && ./gradlew
COMPOSE := docker compose
COMPOSE_DEV := docker compose -f compose.yaml -f compose.dev.yaml
IMAGE_NAME ?= reparo-app
IMAGE_TAG ?= local

.PHONY: help check-env up dev dev-all down logs test build image clean-locks clean-db fe-install fe-dev fe-build

GRADLE_LOCK_DIR := $(BACKEND_DIR)/.gradle/9.4.1

help: ## Lista os comandos disponíveis.
	@printf "Comandos disponíveis:\n"
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z_-]+:.*## / {printf "  %-10s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-env:
	@test -f .env || { \
		printf "Arquivo .env não encontrado. Copie .env.example para .env e configure APP_JWT_SECRET.\n" >&2; \
		exit 1; \
	}

clean-locks: ## Remove locks do Gradle que ficam travados pelo container.
	@find $(BACKEND_DIR)/.gradle -name "*.lock" -type f -delete 2>/dev/null; printf "Locks limpos.\n"

up: check-env ## Sobe a aplicação empacotada com Postgres via Docker Compose.
	@$(COMPOSE) up --build

dev: check-env ## Sobe o fluxo de desenvolvimento com bind mount do backend.
	@$(COMPOSE_DEV) up --build

dev-all: check-env ## Sobe backend (docker) e frontend (Vite) em paralelo.
	@trap 'kill 0' EXIT; $(COMPOSE_DEV) up --build & cd frontend && npm run dev; wait

down: check-env ## Derruba a stack Docker Compose sem remover volumes.
	@$(COMPOSE) down

clean-db: check-env ## Derruba a stack e apaga o volume do banco de dados (reset total).
	@$(COMPOSE) down -v

logs: check-env ## Exibe os logs de todos os serviços da stack.
	@$(COMPOSE) logs -f

test: clean-locks ## Executa os testes do backend com o Gradle wrapper local.
	@$(GRADLE) test

build: clean-locks ## Gera o build do backend com o Gradle wrapper local.
	@$(GRADLE) build

image: ## Gera apenas a imagem Docker da aplicação.
	@docker build --target runtime -t $(IMAGE_NAME):$(IMAGE_TAG) backend

fe-install: ## Instala dependencias do frontend.
	@cd frontend && npm install

fe-dev: ## Sobe o frontend em modo dev (Vite HMR na porta 3000).
	@cd frontend && npm run dev

fe-build: ## Gera build de producao do frontend.
	@cd frontend && npm run build
