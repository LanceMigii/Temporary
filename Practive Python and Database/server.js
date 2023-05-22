const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const fetch = require('node-fetch');

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

app.post('/api', requireLogin, (req, res) => {
  const inputText = req.body.inputText;
  const organizationId = '527652'; // Replace with your actual organization ID

  const url = `https://enterprise-api.writer.com/content/organization/${organizationId}/detect`;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'imYgxJYIKcUqeA_jCRo2Ba-Lcv5j0Yzrv1hgAeCROzKx7HpJWYipC-DwkGcFybflSaqGjc02_8EBGqrZq01oI1a0J1U-PPeD0bWk7HiQQprAcmC7Nts3Xr7At1yN8Q_u',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      input: inputText
    })
  };

  fetch(url, options)
    .then(response => response.json())
    .then(result => {
      const realPercentage = Math.round(result[0].score * 100); // Calculate the percentage for "real"
      const fakePercentage = Math.round(result[1].score * 100); // Calculate the percentage for "fake"

      // Render the results on the api.html page
      res.send(`
        <h1>API Page</h1>
        <form action="/api" method="POST">
          <label for="inputText">Input text (Limit of 1,500 characters at a time):</label>
          <textarea id="inputText" name="inputText" rows="4" cols="50" required>${inputText}</textarea><br><br>
          <input type="submit" value="Submit">
        </form>
        <h2>Results:</h2>
        <pre>Human Generated Content: ${realPercentage}%,<br>AI Generated Content: ${fakePercentage}%</pre>
      `);
    })
    .catch(error => {
      console.error('Error calling the API:', error);
      res.status(500).send('Error calling the API');
    });
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});
