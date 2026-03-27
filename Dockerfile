# Stage 1: Build Frontend Assets
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Install PHP Dependencies
FROM composer:2 AS vendor-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs
COPY . .

# Stage 3: Final Production Image
FROM serversideup/php:8.2-fpm-nginx-alpine

# Use production PHP settings
ENV PHP_OPCACHE_ENABLE=1

USER root

# Set working directory
WORKDIR /var/www/html

# Copy app code
COPY --from=vendor-builder --chown=www-data:www-data /app /var/www/html
# Copy built assets
COPY --from=node-builder --chown=www-data:www-data /app/public/build /var/www/html/public/build

# Set correct storage permissions
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Drop privileges back to the built-in www-data web user
USER www-data

# Notice: We do not need a custom entrypoint or supervisor; 
# serversideup handles Nginx and PHP-FPM together beautifully on port 8080 (which we map to 9000).
