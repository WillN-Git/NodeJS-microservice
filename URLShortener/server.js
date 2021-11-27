require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const Schema = mongoose.Schema;

const url_Schema = new Schema({ //Forme d'une URL dans l'application
  original_url: { type: String, required: true },
  short_url: { type: Number }
});

const URL = mongoose.model("URL", url_Schema);

app.post("/api/shorturl/", function(req, res) {
  let inputUrl = req.body.url;
  let inputShort = 1;
  let url_regex = /^(ftp|http|https):\/\/[^ "]+$/;
  
  if(url_regex.test(inputUrl)) {
    URL
      .findOne({})
      .sort({ short_url: "desc" })
      .exec((err, result) => {
        if (!err && result != undefined) {
          inputShort = result.short_url + 1;
        }
        if (!err) {
          URL.findOneAndUpdate(
            { original_url: inputUrl },
            { original_url: inputUrl, short_url:  inputShort },
            { new: true, upsert: true },
            (err, savedUrl) => {
              if (!err)
                res.json({
                  original_url: savedUrl.original_url,
                  short_url: savedUrl.short_url
                });
            }
          );
        }
      });
  }
  else {
    res.json({
      error: 'invalid url'
    });
  }
});

app.get('/api/shorturl/:inputShort', (request, response) => {
  let inputShort = request.params.inputShort;
  URL.findOne({short_url: inputShort}, (error, result) => {
    if(!error && result != undefined){
      response.redirect(result.original_url)
    }else{
      response.json({
        error: 'URL Does Not Exist'
      });
    }
  })
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
