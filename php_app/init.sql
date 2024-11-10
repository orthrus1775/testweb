-- Create the database
CREATE DATABASE IF NOT EXISTS utility;

-- Use the database
USE utility;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(32) NOT NULL,
    admin TINYINT(1) DEFAULT 0
);

-- Insert admin user with hashed password
INSERT INTO users (id, username, password, admin) VALUES (1, 'admin', MD5('admin_password'), 1);

-- Create billing table
CREATE TABLE IF NOT EXISTS billing (
    user_id INT PRIMARY KEY,
    month_year DATE,
    usage_amount INT,
    bill_amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
