# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS builder

SHELL ["/bin/sh", "-e", "-c"]

WORKDIR /app

ENV CI=true \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"

ARG PNPM_VERSION=11.4.0
ARG PACKAGE_REGISTRY=https://registry.npmmirror.com
ENV COREPACK_NPM_REGISTRY=${PACKAGE_REGISTRY} \
    COREPACK_ENABLE_UNSAFE_CUSTOM_URLS=1 \
    NPM_CONFIG_REGISTRY=${PACKAGE_REGISTRY}

RUN corepack enable && \
    corepack prepare "pnpm@${PNPM_VERSION}" --activate || \
    npm install --global "pnpm@${PNPM_VERSION}"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=perpix-pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm config set registry "${PACKAGE_REGISTRY}" && \
    pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    VITE_APP_FONT_BASE_URL=/fonts

ARG VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT
ARG VITE_PERPIX_API_URL
ARG VITE_PERPIX_APP_URL
ARG VITE_APP_FONT_BASE_URL
ARG VITE_APP_PERPIX_TELEGRAM_SUPPORT
ARG VITE_APP_SENTRY_DSN
ARG VITE_APP_PERPIX_TAX_PERCENT

ENV VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT=${VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT} \
    VITE_PERPIX_API_URL=${VITE_PERPIX_API_URL} \
    VITE_PERPIX_APP_URL=${VITE_PERPIX_APP_URL} \
    VITE_APP_FONT_BASE_URL=${VITE_APP_FONT_BASE_URL} \
    VITE_APP_PERPIX_TELEGRAM_SUPPORT=${VITE_APP_PERPIX_TELEGRAM_SUPPORT} \
    VITE_APP_SENTRY_DSN=${VITE_APP_SENTRY_DSN} \
    VITE_APP_PERPIX_TAX_PERCENT=${VITE_APP_PERPIX_TAX_PERCENT}

RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

USER nginx
WORKDIR /usr/share/nginx/html

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/dist .

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
