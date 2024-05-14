# Carrega as variáveis de ambiente do arquivo .env
include .env

# Define a função para criar o comando Docker Compose
DOCKER_COMPOSE_COMMAND = docker compose --profile $(or $(1),$(NODE_ENV)) -f services/docker-compose.yaml --env-file .env

# Define a função para gerar certificados SSL de desenvolvimento
define generate_certificates
	if [ -n "$(wildcard $(1)/*)" ]; then \
		echo "Certificados já existem em $(1)"; \
	else \
		echo "Domínio de dev: $(NEXT_PUBLIC_DOMAIN_NAME)"; \
		mkdir -p $(1); \
		mkcert -cert-file $(1)/fullchain.pem -key-file $(1)/privkey.pem unibus.fbi.com '*.unibus.fbi.com'; \
	fi
endef


# Executa o comando dentro do container
ifeq (,$(filter $(firstword $(MAKECMDGOALS)),run-container))
%:
	@docker exec -it unibus_website sh -c "cd /app && $(MAKECMDGOALS)"
endif

# Comando para subir os serviços
up: ssl
	@if [ "$$(docker ps -aq)" ]; then docker rm -f $$(docker ps -aq); fi;
	
	@if [ "$(NODE_ENV)" = "production" ]; then \
		$(DOCKER_COMPOSE_COMMAND) up -d --build --remove-orphans; \
	else \
		$(DOCKER_COMPOSE_COMMAND) up -d --remove-orphans; \
	fi

# Comando para encerrar os serviços
down:
    @RUNNING_CONTAINERS=$$(docker container ls -q); \
    STOPPED_CONTAINERS=$$(docker container ls -q -f status=exited); \
    if [ ! -z "$$RUNNING_CONTAINERS" ]; then \
        echo "Parando contêineres em execução..."; \
        docker container stop $$RUNNING_CONTAINERS; \
        docker container rm $$RUNNING_CONTAINERS; \
    fi; \
    if [ ! -z "$$STOPPED_CONTAINERS" ]; then \
        echo "Removendo contêineres parados..."; \
        docker container rm $$STOPPED_CONTAINERS; \
    fi


# Comando para construir as imagens
build:
	$(call DOCKER_COMPOSE_COMMAND) build

certbot:
	@if [ "$$(docker ps -aq)" ]; then \
		echo "Removendo os seguintes contêineres Docker:"; \
		docker rm -f $$(docker ps -aq); \
		echo ""; \
	fi
	@data="./services/ssl/data/"; \
	source="$${data}letsencrypt/live/$(NEXT_PUBLIC_DOMAIN_NAME)/"; \
	destino="./services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)/"; \
	echo "Pasta de dados: $$data"; \
	echo "Pasta de origem: $$source"; \
	echo "Pasta de destino: $$destino"; \
	echo ""; \
	rm -rf "$$data"; \
	mkdir -p "$$data"; \
	rm -rf "$$destino"*; \
	echo "Subindo o container certbot"; \
	$(call DOCKER_COMPOSE_COMMAND,certbot) up -d; \
	echo ""; \
	echo "LOGS:"; \
	docker logs -f unibus_ssl; \
	echo ""; \
	echo "Aguardando o certificado SSL..."; \
	while [ ! -d "$$source" ]; do \
		echo "Aguardando o certificado SSL em $$source..."; \
		sleep 5; \
	done; \
	cp -L "$$source"* "$$destino"; \
	echo ""; \
	echo "Arquivos em $$source:"; \
	ls -l "$$source"; \
	echo ""; \
	echo "Arquivos em $$destino:"; \
	ls -l "$$destino"; \
	echo ""; \
	echo "Removendo o container certbot e iniciando os containers"; \
	$(MAKE) up

# Comando para criar certificados SSL
ssl:
	@if [ -d "services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)" ]; then \
		if [ $$(ls -A "services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)" | wc -l) -gt 0 ]; then \
			echo "Certificados SSL encontrados!"; \
		else \
			echo "Nenhum certificado encontrado no diretório."; \
			$(call generate_certificates,"services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)") \
		fi; \
	else \
		mkdir -p "services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)"; \
		echo "Diretório de certificados SSL criado."; \
		$(call generate_certificates,"services/proxy/certs/$(NEXT_PUBLIC_DOMAIN_NAME)") \
	fi


destroy:
	@RUNNING_CONTAINERS=$$(docker container ls -q); \
	STOPPED_CONTAINERS=$$(docker container ls -q -f status=exited); \
	if [ ! -z "$$RUNNING_CONTAINERS" ]; then \
		echo "Parando contêineres em execução..."; \
		docker container stop $$RUNNING_CONTAINERS; \
		docker container rm $$RUNNING_CONTAINERS; \
	fi; \
	if [ ! -z "$$STOPPED_CONTAINERS" ]; then \
		echo "Removendo contêineres parados..."; \
		docker container rm $$STOPPED_CONTAINERS; \
	fi; \
	if [ $$(docker image ls -q | wc -l) -gt 0 ]; then \
		echo "Removendo imagens..."; \
		docker image rm $$(docker image ls -aq); \
	fi; \
	if [ $$(docker volume ls -q | wc -l) -gt 0 ]; then \
		echo "Removendo volumes..."; \
		docker volume rm $$(docker volume ls -q); \
	fi; \
	NETWORKS_TO_REMOVE=$$(docker network ls --format "{{.ID}}:{{.Name}}" | grep -v 'bridge\|host\|none' | cut -d ':' -f1); \
	if [ ! -z "$$NETWORKS_TO_REMOVE" ]; then \
		echo "Removendo redes..."; \
		docker network rm $$NETWORKS_TO_REMOVE; \
	fi; \
	docker builder prune -f; \
	echo "Remoção concluída."

# Comando para subir os serviços
a9g:
	$(call DOCKER_COMPOSE_COMMAND,a9g) up -d --build --remove-orphans
	@docker exec -it gprs_builder bash && \
	$(call DOCKER_COMPOSE_COMMAND,a9g) down  

# Diretiva que informa ao Make que a regra não cria um arquivo com o nome do comando
.PHONY: up down certbot build certbot-test ssl