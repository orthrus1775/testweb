import csv
import random
import requests
from datetime import datetime, timedelta
import hashlib

# Function to download files from GitHub
def download_file(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
            print(f"Downloaded {filename} successfully.")
    else:
        print(f"Failed to download {filename}.")

# Function to generate random password
def generate_password(length=15):
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    return ''.join(random.choice(characters) for i in range(length))

# Function to generate random user ID
def generate_user_id():
    return random.randint(100, 1000000)

# Function to generate random date in April 2024
def generate_random_date():
    start_date = datetime(2024, 4, 1)
    end_date = datetime(2024, 4, 30)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Function to generate random number between 50 and 500
def generate_random_number():
    return random.randint(50, 500)

# Function to generate result of random number multiplied by 0.20
def calculate_percentage(number):
    return round(number * 0.20, 2)

# Function to hash password using MD5
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# Downloading files from GitHub
download_file('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/familynames-usa-top1000.txt', 'familynames.txt')
download_file('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/femalenames-usa-top1000.txt', 'femalenames.txt')
download_file('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/malenames-usa-top1000.txt', 'malenames.txt')
download_file('https://github.com/danielmiessler/SecLists/raw/master/Passwords/Leaked-Databases/rockyou-75.txt', 'rockyou.txt')

# Reading first names from files
with open('femalenames.txt') as f:
    female_names = f.readlines()

with open('malenames.txt') as f:
    male_names = f.readlines()

# Reading last names from file
with open('familynames.txt') as f:
    last_names = f.readlines()

# Generate usernames
usernames = []
for first in female_names + male_names:
    first = first.strip().lower()
    for last in last_names:
        last = last.strip().lower()
        usernames.append(f"{first}.{last}")

# Shuffle the usernames
random.shuffle(usernames)

# Generate data and write to CSV
with open('user_data.csv', 'w', newline='') as csvfile:
    fieldnames = ['Username', 'Password', 'User_ID', 'Date', 'Random_Number', 'Percentage']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    
    count = 0
    passwords = []
    try:
        # Select 1600 passwords from rockyou.txt
        with open('rockyou.txt', 'r', encoding='utf-8', errors='ignore') as password_file:
            passwords.extend(password_file.readlines())
            passwords = random.sample(passwords, min(len(passwords), 1600))
    except FileNotFoundError:
        print("rockyou.txt not found.")

    while count < 20:
        username = usernames[count % len(usernames)]
        
        try:
            password = passwords.pop()
            password = password.strip()  # Remove trailing newline
            #hashed_password = hash_password(password)
            hashed_password = password
        except IndexError:
            print("No more passwords in rockyou.txt. Generating random password.")
            password = generate_password()
            hashed_password = hash_password(password)
        
        user_id = generate_user_id()
        date = generate_random_date().strftime('%m/%d/%Y')
        random_number = generate_random_number()
        percentage = calculate_percentage(random_number)
        
        writer.writerow({
            'Username': username,
            'Password': hashed_password,
            'User_ID': user_id,
            'Date': date,
            'Random_Number': random_number,
            'Percentage': percentage
        })
        
        count += 1

print("CSV file created successfully with 8000 records!")
