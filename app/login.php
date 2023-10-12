<?php
// Establish a database connection (replace with your DB credentials)
$conn = new mysqli("localhost", "username", "password", "utility");

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