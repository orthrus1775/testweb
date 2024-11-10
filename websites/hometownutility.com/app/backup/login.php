<?php
session_start(); // Start the session

// Read MySQL connection details from environment variables
$host = "mysql";
$db_port = 3306;
$database = "utility";
$username = "root";
$password = "NewPa$$Word123!";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Get user input
$username = $_POST['username'];
$password = $_POST['password'];

// Sanitize input
$username = $conn->real_escape_string($username);
$password = $conn->real_escape_string($password);

// Check if the username exists in the database
$sql = "SELECT * FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $hashed_password = md5($password); // Hash the provided password for comparison

    if ($user['password'] === $hashed_password) {
        // Passwords match
        session_start();
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username; // Store username in session

        if ($user['admin'] == 1) {
            // User is an admin
            $_SESSION['admin'] = true;
            header("Location: admin.php");
            exit;
        } else {
            // Non-admin user
            $_SESSION['admin'] = false;
            header("Location: billing_query.php");
            exit;
        }
    } else {
        // Passwords do not match
        echo "Invalid password. <a href='index.php'>Try again</a>";
    }
} else {
    // Username does not exist
    echo "Invalid username. <a href='index.php'>Try again</a>";
}

$conn->close();
?>
