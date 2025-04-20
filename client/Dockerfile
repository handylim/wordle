# Use a Node.js image for building the project
FROM node:22.14.0 AS builder

# Set working directory
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install dependencies and build the application
RUN corepack enable &&  \
    corepack prepare pnpm@10.8.1 --activate && \
    pnpm install --frozen-lockfile && \
    pnpm run build

# Use a lightweight Node image for production
FROM node:22.14.0-alpine3.21

# Set working directory in the new image
WORKDIR /app

# Set PNPM_HOME and add it to the PATH
ENV PNPM_HOME=/root/.pnpm
ENV PATH=$PNPM_HOME:$PATH

# Install a lightweight HTTP server to serve the static files
RUN apk add -U tzdata && \
    corepack enable &&  \
    corepack prepare pnpm@10.8.1 --activate &&  \
    pnpm install -g serve

# Copy the built files from the previous build stage
COPY --from=builder /app/dist /app

# Expose the port
EXPOSE 3000