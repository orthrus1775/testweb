<!DOCTYPE html>
<html>
<head>
    <title>Admin Portal</title>
</head>
<body>
    <h2>Admin Portal</h2>
    <p>Welcome, Admin!</p>
    
    <!-- Form for updating customer billing and usage -->
    <form action="update_billing.php" method="post">
        <label for="account_number">Account Number:</label>
        <input type="text" id="account_number" name="account_number" required><br><br>
        <label for="kw_usage">kW Usage:</label>
        <input type="text" id="kw_usage" name="kw_usage" required><br><br>
        <label for="cost">Cost:</label>
        <input type="text" id="cost" name="cost" required><br><br>
        <input type="submit" value="Update Billing and Usage">
    </form>
</body>
</html>
