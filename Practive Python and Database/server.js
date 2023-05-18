const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host:'127.0.0.1',
  database:'practice',
  user:'root',
  password:'jmc12345'
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

app.post('/registration', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results) => {
    if (error) {
      console.error('Error registering user: ', error);
      res.status(500).send('Error registering user');
    } else {
      console.log('User registered successfully');
      res.status(200).send('User registered successfully');
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
