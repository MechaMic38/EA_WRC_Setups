# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG PHP_VERSION=8.3

# Stage 1: Compile frontend assets.
FROM node:${NODE_VERSION}-alpine AS frontend

WORKDIR /app

COPY src/package.json src/package-lock.json ./
RUN npm ci

COPY src/ ./
RUN npm run build


# Stage 2: Build the Laravel application.
FROM php:${PHP_VERSION}-apache AS app

# Install PHP dependencies and required extensions.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libbz2-dev \
    libfreetype6-dev \
    libgmp-dev \
    libicu-dev \
    libjpeg-dev \
    libonig-dev \
    libpng-dev \
    libssl-dev \
    libxml2-dev \
    libzip-dev \
    pkg-config \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        bz2 \
        gd \
        gmp \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        soap \
        zip \
    && pecl install mongodb-1.19.0 \
    && docker-php-ext-enable mongodb \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Install Composer.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

# Copy application source code into the image.
COPY src/ ./

# Copy compiled frontend assets from the Node stage.
COPY --from=frontend /app/public/build/ ./public/build/

# Configure Apache to listen on Render's default HTTP port.
RUN sed -ri 's/^Listen 80$/Listen 10000/' /etc/apache2/ports.conf

COPY docker/apache/000-default.conf \
    /etc/apache2/sites-available/000-default.conf

# Install production dependencies and prepare writable directories.
RUN mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && composer install \
        --no-dev \
        --prefer-dist \
        --no-interaction \
        --no-progress \
        --optimize-autoloader \
    && ln -s ../storage/app/public public/storage \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["apache2-foreground"]
