#!/bin/sh
set -e

# Wait for database if needed (optional but good for stability)
# You could use a tool like wait-for-it.sh here

# Run composer install if vendor doesn't exist (useful for dev/mounting)
if [ ! -d "vendor" ]; then
    composer install --optimize-autoloader --no-dev
fi

# Run migrations
php artisan migrate --force

# Cache configuration and routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Execute the main command (php-fpm)
exec "$@"
