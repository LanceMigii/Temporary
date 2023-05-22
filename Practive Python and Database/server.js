const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  database: 'practice',
  user: 'root',
  password: 'jmc12345'
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  })
);

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    // User is logged in, proceed to the next middleware
    next();
  } else {
    // User is not logged in, redirect to the login page
    res.redirect('/home');
  }
};

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

app.get('/api.html', requireLogin, (req, res) => {
  res.sendFile(__dirname + '/api.html');
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
        req.session.isLoggedIn = true; // Set isLoggedIn flag in session
        res.redirect('/api.html'); // Redirect to api.html upon successful login
      } else {
        console.log('Invalid credentials');
        res.status(401).send('Invalid credentials');
      }
    }
  });
});

app.post('/registration', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username is already taken
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error checking username availability:', error);
      res.status(500).send('Error checking username availability');
    } else {
      if (results.length > 0) {
        // Username is already taken
        console.log('Username already exists');
        res.status(409).send('Username already exists');
      } else {
        // Username is available, proceed with registration
        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results) => {
          if (error) {
            console.error('Error registering user:', error);
            res.status(500).send('Error registering user');
          } else {
            console.log('Registration successful');
            req.session.isLoggedIn = true; // Set isLoggedIn flag in session
            res.redirect('/api.html'); // Redirect to api.html after registration
          }
        });
      }
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
