<!DOCTYPE html>
<html>
<head>
    <title>Admin Portal</title>
    <style>
        .overdue {
            color: red;
        }
    </style>
</head>
<body>
    <h2>Admin Portal</h2>
    <p>Welcome, Admin!</p>

    <!-- Form for updating customer billing -->
    <h3>Update Customer Billing</h3>
    <form action="update_billing.php" method="post">
        <label for="account_number">Account Number:</label>
        <input type="text" id="account_number" name="account_number" required><br><br>
        <label for="kw_usage">kW Usage:</label>
        <input type="text" id="kw_usage" name="kw_usage" required><br><br>
        <label for="cost">Cost:</label>
        <input type="text" id="cost" name="cost" required><br><br>
        <label for="due_date">Due Date:</label>
        <input type="date" id="due_date" name="due_date" required><br><br>
        <input type="submit" value="Update Billing and Usage">
    </form>

    <!-- Form for querying customer billing -->
    <h3>Query Customer Billing</h3>
    <form action="billing_query.php" method="post">
        <label for="account_query">Account Number:</label>
        <input type="text" id="account_query" name="account_query" required>
        <input type="submit" value="Query Billing and Usage">
    </form>

</body>
</html>