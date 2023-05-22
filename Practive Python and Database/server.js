const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  database: 'practice',
  user: 'root',
  password: 'jmc12345'
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Error logging in: ', error);
      res.status(500).send('Error logging in');
    } else {
      if (results.length > 0) {
        console.log('Login successful');
        res.status(200).send('Login successful');
      } else {
        console.log('Invalid credentials');
        res.status(401).send('Invalid credentials');
      }
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
