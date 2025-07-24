ARG PHP_VERSION=8.3

FROM php:${PHP_VERSION}-fpm

# Create the laravel group and user
RUN groupadd -g 1000 laravel || true && \
    useradd -u 1000 -g laravel -s /bin/bash -m laravel

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev libjpeg-dev libpng-dev libzip-dev libgmp-dev \
    libonig-dev libbz2-dev libxml2-dev zlib1g-dev libicu-dev libssl-dev pkg-config \
    g++ curl git unzip zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo pdo_mysql bcmath bz2 gd gmp intl opcache soap zip

# INSTALL COMPOSER
COPY --from=composer /usr/bin/composer /usr/bin/composer

# INSTALL MONGODB
RUN pecl install mongodb-1.19.0 \
    && docker-php-ext-enable mongodb

# Create the application directory
RUN mkdir -p /var/www/html

# Change the ownership of the directory to the Laravel user
RUN chown -R laravel:laravel /var/www/html

# Switch to the Laravel user for security reasons
USER laravel

# Set the working directory
WORKDIR /var/www/html
