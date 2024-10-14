const url = require('url');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/transcriptor.db'); // Update the database path as needed

// Adjust the paths for header and footer files based on your project structure
const headerFilePath = __dirname + '/../views/header.html';
const footerFilePath = __dirname + '/../views/footer.html';

/// Middleware for user authentication
exports.authenticate = function (request, response, next) {
    let auth = request.headers.authorization;
  
  
    if (request.url === '/create-user.html') {
      next();
      return;
    }
  
    if (!auth) {
      response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
      response.writeHead(401, { 'Content-Type': 'text/html' });
      console.log('No authorization found, send 401.');
      response.end();
    }  else {
      var tmp = auth.split(' ');
      var buf = Buffer.from(tmp[1], 'base64');
      var plain_auth = buf.toString();
      var credentials = plain_auth.split(':');
      var username = credentials[0];
      var password = credentials[1];
  
      var authorized = false;
      var retrievedUserRole = null;
  
      // Check database for user
      db.all('SELECT userid, password, role FROM users', function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].userid == username && rows[i].password == password) {
            authorized = true;
            retrievedUserRole = rows[i].role;
          }
        }
        if (!authorized) {
          // Redirect to create user page if not authorized
          response.redirect('/create-user.html'); // Update the route accordingly
        } else {
          request.user_role = retrievedUserRole;
          next();
        }
      });
    }
  };
  

// Function to handle user details
function send_users(request, response, rows) {
  fs.readFile(headerFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);

    // Insert user data
    for (let row of rows) {
      response.write(`<p>user: ${row.userid} password: ${row.password}</p>`);
    }

    fs.readFile(footerFilePath, function(err, data) {
      if (err) {
        handleError(response, err);
        return;
      }
      response.write(data);
      response.end();
    });
  });
}

// Function to handle index.html
exports.index = function(request, response) {
  fs.readFile(headerFilePath, function(err, data) {
    if (err) {
      handleError(response, err);
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);


    fs.readFile(footerFilePath, function(err, data) {
      if (err) {
        handleError(response, err);
        return;
      }
      response.write(data);
      response.end();
    });
  });
};

// Function to handle user details route
exports.users = function(request, response) {
  if (request.user_role === 'admin') {
    db.all("SELECT userid, password FROM users", function(err, rows) {
      send_users(request, response, rows);
    });
  } else {
    response.status(403).send('ERROR. Admin Privileges Required To See Users');
  }
};

// Function to handle find route
exports.find = function(request, response) {
  let urlObj = parseURL(request, response);
  let sql = "SELECT id, title FROM songs";

  if (urlObj.query['title']) {
    console.log("finding title: " + urlObj.query['title']);
    const formattedTitle = urlObj.query['title'].replace(/ /g, '%');
    sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
      formattedTitle + "%'";
    console.log("SQL:   "+sql);
  }

  db.all(sql, function(err, rows) {
    console.log('ROWS: ' + typeof rows+rows);
    send_find_data(request, response, rows);
  });
};

// Function to handle song details route
exports.songDetails = function(request, response) {
  let urlObj = parseURL(request, response);
  let songID = urlObj.path;
  songID = songID.substring(songID.lastIndexOf("/") + 1, songID.length);

  let sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + songID;
  console.log("GET SONG DETAILS: " + songID);

  db.all(sql, function(err, rows) {
    console.log('Song Details Data');
    send_song_details(request, response, rows);
  });
};

// Function to parse URL
function parseURL(request, response) {
  const PARSE_QUERY = true; // Parse query string if true
  const SLASH_HOST = true; // Slash denotes host if true
  let urlObj = url.parse(request.url, PARSE_QUERY, SLASH_HOST);
  console.log('path:');
  console.log(urlObj.path);
  console.log('query:');
  console.log(urlObj.query);
  return urlObj;
}

// Error handling function
function handleError(response, err) {
  console.log('ERROR: ' + JSON.stringify(err));
  response.writeHead(404);
  response.end(JSON.stringify(err));
}
