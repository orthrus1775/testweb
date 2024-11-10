<?php
// Establish a database connection (replace with your DB credentials)
$host = "mysql";
$db_port = 3306;
$database = "utility";
$username = "root";
$password = "my-secret-pw";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $database);

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
