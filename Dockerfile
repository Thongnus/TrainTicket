# Simple Dockerfile for testing
FROM node:18-alpine

# Install dependencies for Alpine Linux
RUN apk add --no-cache libc6-compat git

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start development server
CMD ["pnpm", "dev"] 