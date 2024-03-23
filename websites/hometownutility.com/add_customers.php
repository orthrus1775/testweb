<?php
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
$customer_id = $_POST['customer_id'];
$date = $_POST['date'];
$kw_usage = $_POST['kw_usage'];
$cost = $_POST['cost'];

// Check if the customer ID already exists
$check_sql = "SELECT * FROM billing_data WHERE account_number = '$customer_id'";
$check_result = $conn->query($check_sql);

if ($check_result->num_rows > 0) {
    echo "Customer ID already in use. Please use another ID.";
} else {
    // Insert the new customer information into the database
    $insert_sql = "INSERT INTO billing_data (account_number, due_date, kw_usage, cost) VALUES ('$customer_id', '$date', '$kw_usage', '$cost')";

    if ($conn->query($insert_sql) === TRUE) {
        echo "New customer added successfully.";
    } else {
        echo "Error adding customer: " . $conn->error;
    }
}

$conn->close();
?>
