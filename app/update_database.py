import pandas as pd
import pymysql  # Use the appropriate MySQL library for your needs

# MySQL database connection settings (replace with your credentials)
db_host = "mysql"  # Assuming your MySQL service is named "mysql" in Docker
db_user = "root"
db_password = "your_password"
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
        customer_id = row['Customer ID']
        date = row['Date']
        usage_kw = row['Usage (KW)']
        bill_amount = row['Bill Amount']

        # Insert or update the data in the database
        sql = """
        INSERT INTO usage (user_id, month_year, usage, bill_amount)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        usage = VALUES(usage),
        bill_amount = VALUES(bill_amount)
        """
        cursor.execute(sql, (customer_id, date, usage_kw, bill_amount))

    conn.commit()
    cursor.close()
    conn.close()

except pymysql.Error as e:
    print(f"Database error: {e}")

print("Database updated successfully.")