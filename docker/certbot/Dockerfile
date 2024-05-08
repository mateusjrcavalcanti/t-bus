# Use a imagem oficial do Certbot como base
FROM certbot/certbot:latest

# Copie o script de pós-deploy para dentro do contêiner
COPY deploy-script.sh /usr/local/bin/deploy-script.sh

# Torne o script executável
RUN chmod +x /usr/local/bin/deploy-script.sh