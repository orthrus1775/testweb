import csv
import pymysql
from pymysql import Error
from datetime import datetime
import uuid

# Function to connect to MySQL database
def connect_to_mysql():
    try:
        connection = pymysql.connect(
            host="127.0.0.1",
            database="utility",
            user="root",
            password="NewPa$$Word123!"
        )
        print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

# Function to insert data into users table
def insert_into_users(connection, user_id, username, password):
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO users (id, username, password) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password)"
            cursor.execute(query, (user_id, username, password))
            connection.commit()
        #print(f"Inserted into users table: {user_id}, {username}, {password}")
    except Error as e:
        print(f"Error inserting into users table: {e}")

# Function to insert data into billing table
def insert_into_billing(connection, user_id, kw_usage, cost, due_date):
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO billing_data (user_id, kw_usage, cost, due_date) VALUES (%s, %s, %s, %s)" 
            cursor.execute(query, (user_id, kw_usage, cost, due_date))
            connection.commit()
        #print(f"Inserted into billing table: {user_id}, {account_number}, {kw_usage}, {cost}, {due_date}")
    except Error as e:
        print(f"Error inserting into billing table: {e}")

# Connect to MySQL database
connection = connect_to_mysql()

# Read data from CSV file and update database
if connection:
    try:
        with open('user_data.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                username = row['Username']
                password = row['Password']
                user_id = row['User_ID']
                date_str = row['Date']
                kw_usage = row['Random_Number']
                cost = row['Percentage']
                
                account_number = uuid.uuid4()
                # Convert date format to MySQL format ('YYYY-MM-DD')
                due_date = datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
                
                # Hash the password using MD5
                hashed_password = password
                
                # Insert into users table
                insert_into_users(connection, user_id, username, hashed_password)
                
                # Insert into billing table
                insert_into_billing(connection, user_id, kw_usage, cost, due_date)
    except FileNotFoundError:
        print("CSV file not found.")
    finally:
        connection.close()
        print("Connection closed.")