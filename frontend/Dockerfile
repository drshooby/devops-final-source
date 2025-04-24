# Stage 1: Build Vite app
FROM node:slim AS builder

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine-slim

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config (for single-page app routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]