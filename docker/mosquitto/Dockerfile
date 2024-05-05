FROM iegomez/mosquitto-go-auth:2.1.0-mosquitto_1.6.14

# Adiciona o script de entrada
COPY start.sh /usr/local/bin/start.sh

# Adicione o arquivo de configuração
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf

# Concede permissão de execução ao script
RUN chmod +x /usr/local/bin/start.sh

# Define o comando de entrada
ENTRYPOINT [ "/usr/local/bin/start.sh" ]