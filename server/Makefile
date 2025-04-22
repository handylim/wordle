.PHONY: dev prod

# Detect available Compose
ifneq ($(shell docker compose version >/dev/null 2>&1 && echo ok),)
  COMPOSE = docker compose #  Compose V2
else ifneq ($(shell command -v docker-compose),)
  COMPOSE = docker-compose # Compose V1
else
  $(error "Neither 'docker compose' (V2) nor 'docker-compose' (V1) found on PATH")
endif

dev:
	$(COMPOSE) down -v --rmi all
	$(COMPOSE) build --force-rm
	GO_ENV=development $(COMPOSE) up -d

prod:
	$(COMPOSE) down -v --rmi all
	$(COMPOSE) build --force-rm
	GO_ENV=production $(COMPOSE) up -d

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down -v --rmi all