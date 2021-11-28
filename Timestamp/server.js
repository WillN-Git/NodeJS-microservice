// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/", (req, res) => {
  res.json({
    unix: Date.now(),
    utc: Date()
  });
});

app.get("/api/:date_str", (req, res) => {
  const date_str  = req.params.date_str;

  let date;

  if(!isNaN(Date.parse(date_str)))
    res.json({
      unix: new Date(date_str).valueOf(),
      utc: new Date(date_str).toUTCString()
    });
  else if(/\d{5,}/.test(date_str))
    res.json({
      unix: new Date(parseInt(date_str)).valueOf(),
      utc: new Date(parseInt(date_str)).toUTCString()
    });
  else
    res.json({
      error: "Invalid Date"
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
