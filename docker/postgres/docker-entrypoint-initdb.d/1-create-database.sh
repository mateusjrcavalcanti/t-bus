#!/bin/bash

# Extrai as variáveis da URL
USER=$(echo $DATABASE_URL | sed -e 's,postgres://\(.*\):\(.*\)@.*,\1,')
PASSWORD=$(echo $DATABASE_URL | sed -e 's,postgres://\(.*\):\(.*\)@.*,\2,')
HOST=$(echo $DATABASE_URL | sed -e 's,postgres://.*@\(.*\):.*,\1,')
PORT=$(echo $DATABASE_URL | sed -e 's,postgres://.*:\(.*\)/.*,\1,')
DBNAME=$(echo $DATABASE_URL | sed -e 's,postgres://.*@.*:\(.*\)/\(.*\),\2,')

psql -U $POSTGRES_USER -d postgres -c "CREATE ROLE $USER WITH LOGIN PASSWORD '$PASSWORD';"
psql -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $DBNAME;"
psql -U $POSTGRES_USER -d postgres -c "ALTER DATABASE $DBNAME OWNER TO $USER;"
psql -U $POSTGRES_USER -d postgres -c "CREATE DATABASE shadow;"
psql -U $POSTGRES_USER -d postgres -c "ALTER DATABASE shadow OWNER TO $USER;"