SHELL := /bin/sh

.DEFAULT_GOAL := help

BACKEND_DIR := backend
GRADLE := cd $(BACKEND_DIR) && ./gradlew
COMPOSE := docker compose
COMPOSE_DEV := docker compose -f compose.yaml -f compose.dev.yaml
IMAGE_NAME ?= reparo-app
IMAGE_TAG ?= local

.PHONY: help check-env up dev down logs test build image

help: ## Lista os comandos disponíveis.
	@printf "Comandos disponíveis:\n"
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z_-]+:.*## / {printf "  %-10s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-env:
	@test -f .env || { \
		printf "Arquivo .env não encontrado. Copie .env.example para .env e configure APP_JWT_SECRET.\n" >&2; \
		exit 1; \
	}

up: check-env ## Sobe a aplicação empacotada com Postgres via Docker Compose.
	@$(COMPOSE) up --build

dev: check-env ## Sobe o fluxo de desenvolvimento com bind mount do backend.
	@$(COMPOSE_DEV) up --build

down: check-env ## Derruba a stack Docker Compose sem remover volumes.
	@$(COMPOSE) down

logs: check-env ## Exibe os logs de todos os serviços da stack.
	@$(COMPOSE) logs -f

test: ## Executa os testes do backend com o Gradle wrapper local.
	@$(GRADLE) test

build: ## Gera o build do backend com o Gradle wrapper local.
	@$(GRADLE) build

image: ## Gera apenas a imagem Docker da aplicação.
	@docker build --target runtime -t $(IMAGE_NAME):$(IMAGE_TAG) backend
