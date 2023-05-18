import mysql.connector

# Define the login function
def login():
    # Prompt the user for username and password
    username = input("Enter your username: ")
    password = input("Enter your password: ")

    # Perform database query to check credentials
    select_query = "SELECT COUNT(*) FROM user WHERE Username = %s AND Password = %s"
    cursor.execute(select_query, (username, password))
    result = cursor.fetchone()

    if result[0] == 1:
        print("Login successful!")
        return True
    else:
        print("Incorrect username or password.")
        return False

# Establish a connection
cnx = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="jmc12345",
    database="practice"
)

# Create a cursor
cursor = cnx.cursor()

# Call the login function
login_success = login()

# Close the connection
cursor.close()
cnx.close()
