<?php
if (isset($_POST['account_query'])) {
    // Establish a database connection (replace with your DB credentials)
    $host = "mysql";
    $db_port = 3306;
    $database = "utility";
    $username = "root";
    $password = "NewPa$$Word123!";

    // Establish a database connection
    $conn = new mysqli($host, $username, $password, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Get input from the form
    $accountNumberQuery = $_POST['account_query'];

    // Query the database based on the provided account number (without prepared statement)
    $query = "SELECT kw_usage, cost, due_date FROM billing_data WHERE account_number = '$accountNumberQuery'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $kwUsage = $row['kw_usage'];
        $cost = $row['cost'];
        $dueDate = $row['due_date'];

        echo "<br><br>";
        if ($dueDate) {
            $today = date('Y-m-d');
            $dueDate = date('Y-m-d', strtotime($dueDate));
            if (strtotime($today) > strtotime($dueDate) + 30 * 24 * 3600) {
                echo "Account is <span class='overdue'>OVERDUE</span>";
            }
        }
        echo "KW Usage: $kwUsage<br>";
        echo "Current Bill Amount: $cost<br>";
        echo "Due Date: $dueDate";
    } else {
        echo "Account not found.";
    }

    $conn->close();
}
?>