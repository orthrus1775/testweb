<?php
// Read MySQL connection details from environment variables
$host = getenv('MYSQL_HOST');
$database = getenv('MYSQL_DATABASE');
$username = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');

// Establish a database connection
$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user input
$username = $_POST['username'];
$password = $_POST['password'];

// Check if the username and password are valid
$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($user['admin'] == 1) {
        // User is an admin, redirect to the admin portal
        header("Location: admin.php");
    } else {
        echo "You don't have admin privileges. <a href='index.php'>Login as a different user</a>";
    }
} else {
    echo "Invalid username or password. <a href='index.php'>Try again</a>";
}

$conn->close();
?>
