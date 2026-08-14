FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Make scripts executable
RUN chmod +x /var/www/html/public/index.php

# Create database directory
RUN mkdir -p /var/www/html/database

# Expose port
EXPOSE 8000

# Run migrations, seed, and start the server
CMD sh -c "php database/seed.php && php -S 0.0.0.0:8000 -t public public/index.php"
