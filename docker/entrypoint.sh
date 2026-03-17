#!/bin/bash

# Wait for MySQL to be ready
if [ "$DB_CONNECTION" = "mysql" ]; then
    echo "Waiting for mysql..."
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 1
    done
    echo "MySQL started"
fi

# Run migrations
php artisan migrate --force

# Create storage link if not exists
php artisan storage:link || true

# Clear and cache config/routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM in the background
php-fpm -D

# Start Nginx in the foreground
nginx -g 'daemon off;'
