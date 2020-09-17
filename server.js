'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
var bodyParser = require('body-parser');
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

//Creating a schema
const urlSchema = new mongoose.Schema({
  link: String,
  id: Number,
});

//Creating a model for the schema
const urlModel = mongoose.model('urlModel', urlSchema);

// var firstUrl = new urlModel({
//   link: 'https://raahelbaig.netflify.app',
//   id: 1,
// });

// firstUrl.save(function (err, data) {
//   if (err) throw err;
//   console.log('Link saved successfully');
// });

// bodyParsing so that the form data is stored in req.data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

// After getting the id by POST request, handling the get request to the project_url/api/shorturl/id
app.get('/api/shorturl/:id', function (req, res) {
  var requestId = parseInt(req.params.id, 10); // Converting the id into an integer
  urlModel.findOne({ id: requestId }, function (err, docs) {
    // Trying to find the instance with the given id
    if (err) throw err;
    if (docs) {
      // If it exists, redirect to the original link
      console.log('Redirecting to... ' + docs.link);
      res.redirect(docs.link);
    } else {
      // If it doesnt exist, then respond by saying no link for the given id
      console.log('Number doesnt exist in the database');
      res.json({
        error: 'No short URL found for the given input',
      });
    }
  });
});

// Handling the post request for the /api/shorturl/new endpoint
app.post('/api/shorturl/new', function (req, res) {
  var requestLink = req.body.url; // Getting the url input given in the form using req.body parsed by body parser
  const urlObject = new URL(requestLink); // Converting the url so that we can access the hostname required by dns lookup
  console.log(requestLink);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      // If it is NOT a valid URL, then respond by saying Invalid hostname
      res.json({
        error: 'Invalid Hostname',
      });
    } else {
      urlModel.findOne({ link: requestLink }, function (err, docs) {
        // Check if the link already exists
        if (err) throw err;
        console.log(docs);
        if (docs) {
          console.log('Link already exists in the database');
          res.json({
            original_url: requestLink,
            short_url: docs.id,
          });
        } else {
          console.log('Link DOES NOT exist in the database');
          urlModel.countDocuments({}, function (err, count) {
            console.log('Number of users:', count);
            var newVal = new urlModel({
              link: requestLink,
              id: count + 1,
            });

            newVal.save(function (err, data) {
              if (err) throw err;
              console.log('Link added successfully');
            });
            res.json({
              original_url: requestLink,
              short_url: count + 1,
            });
          });
        }
      });
    }
  });
});
