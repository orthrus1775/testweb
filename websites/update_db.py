import csv
import pymysql
from pymysql import Error
from datetime import datetime
import hashlib

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
            query = "INSERT INTO users (id, username, password) VALUES (%s, %s, %s)"
            cursor.execute(query, (user_id, username, password))
            connection.commit()
        #print(f"Inserted into users table: {user_id}, {username}, {password}")
    except Error as e:
        print(f"Error inserting into users table: {e}")

# Function to insert data into billing table
def insert_into_billing(connection, user_id, month_year, usage_amount, bill_amount):
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO billing (user_id, month_year, usage_amount, bill_amount) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user_id, month_year, usage_amount, bill_amount))
            connection.commit()
        #print(f"Inserted into billing table: {user_id}, {month_year}, {usage_amount}, {bill_amount}")
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
                usage_amount = row['Random_Number']
                bill_amount = row['Percentage']
                
                # Convert date format to MySQL format ('YYYY-MM-DD')
                date = datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
                
                # Hash the password using MD5
                #hashed_password = hashlib.md5(password.encode()).hexdigest()
                hashed_password = password
                
                # Insert into users table
                insert_into_users(connection, user_id, username, hashed_password)
                
                # Insert into billing table
                insert_into_billing(connection, user_id, date, usage_amount, bill_amount)
    except FileNotFoundError:
        print("CSV file not found.")
    finally:
        connection.close()
        print("Connection closed.")
