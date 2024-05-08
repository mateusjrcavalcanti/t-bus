#!/bin/bash

echo "Inicio do script de deploy do Certbot"

# Arquivos gerados pelo Certbot
echo "Arquivos do diretório /etc/letsencrypt/live/${DOMAIN_NAME}/ [total: $(ls -la /etc/letsencrypt/live/${DOMAIN_NAME}/ | wc -l)]:"
ls -la /etc/letsencrypt/live/${DOMAIN_NAME}/

# Criar pasta para armazenar os certificados
mkdir -p /etc/certbot/certs/${DOMAIN_NAME}

# Copiar arquivos dos certificados para a pasta do Nginx
cp -r /etc/letsencrypt/live/${DOMAIN_NAME}/* /etc/certbot/certs/${DOMAIN_NAME}/

# Arquivos copiados para a pasta de certificados
echo "Arquivos do diretório /etc/certbot/certs/${DOMAIN_NAME}/ [total: $(ls -la /etc/certbot/certs/${DOMAIN_NAME}/ | wc -l)]:"
ls -la /etc/certbot/certs/${DOMAIN_NAME}/

echo "Fim do script de deploy do Certbot"