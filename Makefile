.PHONY: dev prod stop down \
        dev-client dev-server prod-client prod-server \
        stop-client stop-server \
        down-client down-server \
        client server

# Top‑level dispatchers
dev:
	@echo "🔧 dev target → dispatching..."
	@if [ "$(filter client,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) dev-client; \
	elif [ "$(filter server,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) dev-server; \
	else \
	  $(MAKE) dev-server dev-client; \
	fi

prod:
	@echo "🚀 prod target → dispatching..."
	@if [ "$(filter client,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) prod-client; \
	elif [ "$(filter server,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) prod-server; \
	else \
	  $(MAKE) prod-server prod-client; \
	fi

stop:
	@echo "⛔ stop target → dispatching..."
	@if [ "$(filter client,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) stop-client; \
	elif [ "$(filter server,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) stop-server; \
	else \
	  $(MAKE) stop-client stop-server; \
	fi

down:
	@echo "⬇️ down target → dispatching..."
	@if [ "$(filter client,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) down-client; \
	elif [ "$(filter server,$(MAKECMDGOALS))" != "" ]; then \
	  $(MAKE) down-server; \
	else \
	  $(MAKE) down-client down-server; \
	fi

# Placeholders so "make dev client" or "make prod server" won't error:
client:
	@:
server:
	@:

# Specific sub-targets for client and server
dev-client:
	@echo "🔧 Running development setup for client"
	@$(MAKE) -C client dev

dev-server:
	@echo "🔧 Running development setup for server"
	@$(MAKE) -C server dev

prod-client:
	@echo "🚀 Running $(GO_ENV) setup for client"
	@$(MAKE) -C client prod

prod-server:
	@echo "🚀 Running $(GO_ENV) setup for server"
	@$(MAKE) -C server prod

stop-client:
	@echo "⏳ Stopping client's Docker container"
	@$(MAKE) -C client stop

stop-server:
	@echo "⏳ Stopping server's Docker container"
	@$(MAKE) -C server stop

down-client:
	@echo "⏳ Removing client setup"
	@$(MAKE) -C client down

down-server:
	@echo "⏳ Removing server setup"
	@$(MAKE) -C server down