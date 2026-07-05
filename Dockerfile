# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:$PATH"

# Enable corepack to get pnpm without a global install.
RUN corepack enable

# Install dependencies.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build the app.
COPY . .
ENV NODE_ENV=production

# Provide build-time environment variables for Vite.
ARG VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT
ARG VITE_PERPIXAI_API_URL
ARG VITE_PERPIXAI_APP_URL
ARG VITE_FONT_BASE_URL
ARG VITE_PERPIXAI_TELEGRAM_SUPPORT
ARG VITE_SENTRY_DSN
ARG VITE_PERPIX_TAX_PERCENT
ENV VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT=${VITE_OBJECT_STORAGE_PUBLIC_ENDPOINT}
ENV VITE_PERPIXAI_API_URL=${VITE_PERPIXAI_API_URL}
ENV VITE_PERPIXAI_APP_URL=${VITE_PERPIXAI_APP_URL}
ENV VITE_FONT_BASE_URL=${VITE_FONT_BASE_URL}
ENV VITE_PERPIXAI_TELEGRAM_SUPPORT=${VITE_PERPIXAI_TELEGRAM_SUPPORT}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}
ENV VITE_PERPIX_TAX_PERCENT=${VITE_PERPIX_TAX_PERCENT}

RUN pnpm build

FROM nginx:1.27-alpine AS runner

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
