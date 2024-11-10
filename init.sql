-- Create the database
CREATE DATABASE IF NOT EXISTS utility;

-- Use the database
USE utility;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin TINYINT(1) DEFAULT 0
);

-- Insert an admin user (change the password)
INSERT INTO users (username, password, admin) VALUES ('admin', 'admin_password', 1);

-- Create the billing_data table
CREATE TABLE IF NOT EXISTS `billing_data` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL,
    kw_usage INT,
    cost DECIMAL(10, 2),
    due_date DATE, -- Add the due_date field
    UNIQUE KEY unique_account_number (account_number)
);

-- Create a user with the username 'root' and password 'yourpassword'
CREATE USER 'root'@'%' IDENTIFIED BY 'my-secret-pw';

-- Grant all privileges to the 'root' user for the 'utility' database
GRANT ALL PRIVILEGES ON utility.* TO 'root'@'%';

-- Reload the privileges
FLUSH PRIVILEGES;