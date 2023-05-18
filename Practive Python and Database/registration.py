import mysql.connector
from mysql.connector import Error

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host='127.0.0.1',
            database='practice',
            user='root',
            password='jmc12345'
        )
        if connection.is_connected():
            print('Connected to MySQL database')
        return connection
    except Error as e:
        print(f'Error while connecting to MySQL: {e}')

def register_user(username, password):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = 'INSERT INTO users (username, password) VALUES (%s, %s)'
            values = (username, password)
            cursor.execute(query, values)
            connection.commit()
            print('User registered successfully')
        except Error as e:
            print(f'Error while registering user: {e}')
        finally:
            cursor.close()
            connection.close()

# Usage example
username = input('Enter username: ')
password = input('Enter password: ')
register_user(username, password)
