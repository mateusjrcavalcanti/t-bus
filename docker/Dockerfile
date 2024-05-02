FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm@9.0.1

FROM base AS deps
WORKDIR /app
COPY . .
RUN pnpm i

FROM deps AS dev
WORKDIR /app

CMD pnpm dev --filter=@unibus/web
