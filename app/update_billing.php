<?php
// Establish a database connection (replace with your DB credentials)
$conn = new mysqli("localhost", "username", "password", "utility");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get input from the form
$accountNumber = $_POST['account_number'];
$kwUsage = $_POST['kw_usage'];
$cost = $_POST['cost'];

// Add the logic to update the billing and usage data in the database here

// Redirect back to the admin portal or show a success message
header("Location: admin.php");

$conn->close();
?>
