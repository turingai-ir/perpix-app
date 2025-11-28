# syntax=docker/dockerfile:1.7

# Build stage on latest Node LTS (alpine for small footprint)
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
ARG VITE_APP_API_BASE_URL
ARG VITE_S3_ENDPOINT
ENV VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL}
ENV VITE_S3_ENDPOINT=${VITE_S3_ENDPOINT}
COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist ./ --chown=nginx:nginx
USER nginx
EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]