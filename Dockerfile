# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

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
ARG VITE_API_BASE_URL
ARG VITE_S3_ENDPOINT
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_S3_ENDPOINT=${VITE_S3_ENDPOINT}

RUN test -n "${VITE_API_BASE_URL}" && test -n "${VITE_S3_ENDPOINT}"

RUN pnpm build

FROM nginx:1.27-alpine AS runner

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
