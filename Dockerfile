# Use an official PHP runtime as a parent image
FROM php:7.4-apache

# Set the working directory in the container
WORKDIR /var/www/html

# Copy the PHP application code into the container
COPY app/ /var/www/html/

# Copy the SQL initialization script into the container
COPY database/init.sql /docker-entrypoint-initdb.d/

# Install mysqli extension (required for MySQL database access)
RUN docker-php-ext-install mysqli

# Enable Apache modules for URL rewriting
RUN a2enmod rewrite

# Install MySQL client for database initialization
RUN apt-get update && apt-get install -y default-mysql-client python3-pip

# Copy the Python script and CSV file into the container
COPY app/update_database.py /update_database.py
COPY app/customer_data.csv /customer_data.csv

# Install pandas for Python script
RUN pip install pandas pymysql
RUN python3 /update_database.py

# Define environment variables for database connection
ENV MYSQL_HOST=mysql
ENV MYSQL_DATABASE=utility
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=yourpassword

# Expose port 80
EXPOSE 80

# Start the Apache web server
CMD ["apache2-foreground"]