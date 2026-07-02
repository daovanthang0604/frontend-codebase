FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 1: Builder
FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune dashboard --docker

# Stage 2: Build the Vite application
FROM base AS build
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN corepack enable pnpm && pnpm install --frozen-lockfile --ignore-scripts

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# The build artifacts are generated inside the /app/apps/dashboard/dist/ folder
RUN pnpm build