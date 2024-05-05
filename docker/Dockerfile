ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm@9.0.1

FROM base AS deps
WORKDIR /app
COPY . .
RUN pnpm i

FROM deps AS dev
WORKDIR /app

ENV NEXT_TELEMETRY_DEBUG=1
