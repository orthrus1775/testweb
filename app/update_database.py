import pandas as pd
import pymysql
from datetime import datetime

# MySQL database connection settings (replace with your credentials)
db_host = "127.0.0.1"  # Assuming your MySQL service is named "mysql" in Docker
db_user = "root"
db_password = "my-secret-pw"
db_name = "utility"

# Path to the CSV file
csv_file = "customer_data.csv"  # Update with the actual path

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(csv_file)

# Establish a database connection
try:
    conn = pymysql.connect(host=db_host, user=db_user, password=db_password, db=db_name)
    cursor = conn.cursor()

    for index, row in df.iterrows():
        # Extract data from the DataFrame
        account_number = row[0]  # The first column (0-indexed) is the account number
        date_str = row[1]
        kw_usage = row[2]
        cost = row[3]

        # Convert the date format to MySQL format ('YYYY-MM-DD')
        date = datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')

        # Insert or update the data in the database
        sql = """
        INSERT INTO billing_data (account_number, kw_usage, cost, due_date)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        kw_usage = VALUES(kw_usage),
        cost = VALUES(cost),
        due_date = VALUES(due_date)
        """
        cursor.execute(sql, (account_number, kw_usage, cost, date))

    conn.commit()
    cursor.close()
    conn.close()

except pymysql.Error as e:
    print(f"Database error: {e}")

print("Database updated successfully.")
