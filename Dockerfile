# Stage 1: Install PHP Dependencies
FROM composer:2 AS vendor-builder
WORKDIR /app
COPY composer.json composer.lock ./
# Add --no-scripts to prevent post-install scripts like `php artisan package:discover` from running before the `/app` codebase is copied
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs --no-scripts
COPY . .
RUN composer dump-autoload --optimize --no-dev --no-scripts

# Stage 2: Build Frontend Assets
# We use the serversideup production image to guarantee Laravel has EVERY PHP extension it needs to boot successfully!
FROM serversideup/php:8.4-fpm-nginx-alpine AS node-builder
USER root
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /var/www/html

# Copy the source code AND the installed vendor folder from Stage 1
COPY --from=vendor-builder --chown=www-data:www-data /app /var/www/html

# Switch to the web user so npm permissions are correct
USER www-data

# Clean any copied local cache files so Laravel doesn't try to load dev packages (like Pail) that don't exist in production
RUN rm -rf bootstrap/cache/*.php

# Setup a dummy .env file so Laravel's artisan commands don't crash complaining about missing APP_KEY or DB variables when Vite boots!
RUN cp .env.example .env && php artisan key:generate

# Build frontend assets
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 3: Final Production Image
FROM serversideup/php:8.4-fpm-nginx-alpine

# Use production PHP settings
ENV PHP_OPCACHE_ENABLE=1

USER root

# Install the GD, GMP, BCMath, and Sockets extensions
RUN install-php-extensions gd gmp bcmath sockets intl

# Set working directory
WORKDIR /var/www/html

# Copy app code with vendors from Stage 1
COPY --from=vendor-builder --chown=www-data:www-data /app /var/www/html
# Copy built assets from Stage 2
COPY --from=node-builder --chown=www-data:www-data /var/www/html/public/build /var/www/html/public/build
# Also copy the Wayfinder generated types if they are output to resources/ (Optional, but safe!)
COPY --from=node-builder --chown=www-data:www-data /var/www/html/resources /var/www/html/resources

# Set correct storage permissions
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Drop privileges back to the built-in www-data web user
USER www-data

# Notice: We do not need a custom entrypoint or supervisor; 
# serversideup handles Nginx and PHP-FPM together beautifully on port 8080 (which we map to 9000).
