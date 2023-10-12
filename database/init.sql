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

-- Create the billing/electrical usage table
CREATE TABLE IF NOT EXISTS usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    month_year DATE,
    usage INT,
    bill_amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);