var express = require('express');
var Twitter = require('twitter');

//load config from config.js file
var config = require('./config');

//initialize twitter
var twitter = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

//load express app and middleware
var app = express();
app.use(function(req, res, next) {
  next();
});

//create routes
app.get('/search/tweets', function (req, res) {
  var q = req.query.q;
  console.log('Query: ', q);
  if(!q) {
    res.status(403);
    return res.send({
      error: 'No search query found on your request'
    });
  }

  twitter.get('api/search/tweets', {
    q: q,
    result_type: 'popular'
  }, function(err, tweets) {
    if(err) {
      res.status(500);
      return res.send({
        error: err
      });
    } else {
      var users = [];
      for(var i in tweets.statuses) {
        if(users.length < 5) {
          users.push(tweets.statuses[i].user);
        }
      }
      res.send({
        users: users
      });
    }
  });

});

app.listen(config.PORT, function () {
  console.log('Twitter app listening on port: ', config.PORT);
});
