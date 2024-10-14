// server.js

const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const logger = require('morgan');
const bodyParser = require('body-parser'); // Add this line for form parsing

const app = express();
const port = 3000;

// Middleware
app.use(routes.authenticate);
app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing form data

// Routes
app.get('/index.html', routes.index);
app.get('/users', routes.users);

// New route for handling user creation form submission
app.post('/create-user', (req, res) => {
  const { username, password } = req.body;

  // Add the new user to the database (assuming 'guest' as the default role)
  db.run(`INSERT INTO users (userid, password, role) VALUES (?, ?, ?)`, [username, password, 'guest'], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error creating user');
    } else {
      console.log(`User ${username} created successfully`);
      res.redirect('/index.html'); // Redirect to the home page after user creation
    }
  });
});

app.get('/', (req, res) => {
  // Check if the user is authenticated
  if (req.user_role) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // If not authenticated, redirect to the create user page
    res.redirect('/create-user.html');
  }
});

// Start server
app.listen(port, (err) => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${port} CNTL:-C to stop`);
    console.log('To Test:');
    console.log('guest: user password: secret');
    console.log('admin: admin password: admin');
    console.log('http://localhost:3000/index.html');
    console.log('http://localhost:3000');

  }
});
