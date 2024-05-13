ARG NODE_VERSION=20
ARG NEXT_PUBLIC_DOMAIN_NAME

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

FROM alpine as base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS builder
WORKDIR /app
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @unibus/web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ARG NEXT_PUBLIC_DOMAIN_NAME
RUN apk add --no-cache libc6-compat
RUN apk update
RUN npm i -g pnpm@9.0.1
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i

# Build the project
COPY --from=builder /app/out/full/ .
ENV SKIP_ENV_VALIDATION=True
ENV AUTH_SECRET=secret
ENV NEXT_PUBLIC_DOMAIN_NAME=${NEXT_PUBLIC_DOMAIN_NAME}

RUN pnpm turbo run build --filter=web

FROM base AS production
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENTRYPOINT node apps/web/server.js

FROM installer AS development
WORKDIR /app
ENTRYPOINT pnpm dev --filter='@unibus/web'