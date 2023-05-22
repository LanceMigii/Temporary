import socket
import requests

# Set API endpoint URL and authentication token, incase of error (check the org id and the API key)
url = 'https://enterprise-api.writer.com/content/organization/527652/detect'
API_KEY = 'imYgxJYIKcUqeA_jCRo2Ba-Lcv5j0Yzrv1hgAeCROzKx7HpJWYipC-DwkGcFybflSaqGjc02_8EBGqrZq01oI1a0J1U-PPeD0bWk7HiQQprAcmC7Nts3Xr7At1yN8Q_u'

# Set request headers
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Set up server socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = socket.gethostname()
print(host)
port = 3000
server_socket.bind((host, port))
server_socket.listen(2)
print('\nServer listening on', host, port)

# Start server loop
while True:
    # Accept client connection
    client_socket, addr = server_socket.accept()
    print('\nConnection from', addr)
    
    # Receive client data
    text = client_socket.recv(1024).decode()
    print('\nReceived:', text)
    
    # Parse text (JSON object) and send data to AI Content Detector API
    payload = {"input": text}
    response = requests.post(url, json=payload, headers=headers)

    # Will print response status code and text
    print('Response status code:', response.status_code)
    print('Response text:', response.text)

    # Send response back to client
    client_socket.send(response.text.encode())
    
    # Close client connection
    client_socket.close()