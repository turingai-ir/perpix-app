# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=22
ARG VITE_APP_API_BASE_URL
ARG VITE_S3_ENDPOINT

FROM node:${NODE_VERSION}-alpine

# Build-time env vars for Vite.
ENV VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL}
ENV VITE_S3_ENDPOINT=${VITE_S3_ENDPOINT}

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage a bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build 
RUN pnpm build

# Drop privileges for runtime
USER node

# Use production node environment by default.
ENV NODE_ENV production

# Expose the port that the application listens on.
EXPOSE 4173

# Run the application.
CMD pnpm preview
