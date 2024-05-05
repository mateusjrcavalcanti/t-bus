#!/bin/bash

# Extrai as variáveis da URL
USER=$(echo $DATABASE_URL | sed -e 's,postgres://\(.*\):\(.*\)@.*,\1,')
PASSWORD=$(echo $DATABASE_URL | sed -e 's,postgres://\(.*\):\(.*\)@.*,\2,')
HOST=$(echo $DATABASE_URL | sed -e 's,postgres://.*@\(.*\):.*,\1,')
PORT=$(echo $DATABASE_URL | sed -e 's,postgres://.*:\(.*\)/.*,\1,')
DBNAME=$(echo $DATABASE_URL | sed -e 's,postgres://.*@.*:\(.*\)/\(.*\),\2,')

# Edita o arquivo mosquitto.conf com as variáveis extraídas
sed -i "s/auth_opt_pg_host .*/auth_opt_pg_host $HOST/" /etc/mosquitto/mosquitto.conf
sed -i "s/auth_opt_pg_port .*/auth_opt_pg_port $PORT/" /etc/mosquitto/mosquitto.conf
sed -i "s/auth_opt_pg_dbname .*/auth_opt_pg_dbname $DBNAME/" /etc/mosquitto/mosquitto.conf
sed -i "s/auth_opt_pg_user .*/auth_opt_pg_user $USER/" /etc/mosquitto/mosquitto.conf
sed -i "s/auth_opt_pg_password .*/auth_opt_pg_password $PASSWORD/" /etc/mosquitto/mosquitto.conf

# Inicia o Mosquitto
/usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf
