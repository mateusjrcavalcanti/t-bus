ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm@9.0.1

FROM base AS development
WORKDIR /app
ENTRYPOINT pnpm dev --filter='@unibus/websocket'

FROM base AS production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY . .
RUN pnpm i
RUN pnpm build
ENTRYPOINT pnpm start --filter='@unibus/websocket'
