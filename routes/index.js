var express = require('express');
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');

var client_id = '3036ac0c826f4f5e8b4a8c1a1bc8278d'; // Your client id
var client_secret = '7ce92e60920d43f1b6a48e162422fdeb'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '3036ac0c826f4f5e8b4a8c1a1bc8278d',
  clientSecret : '7ce92e60920d43f1b6a48e162422fdeb',
  redirectUri : 'http://localhost:8888/callback '
});

//Temp Username save  muess nah gänderet werde
var userId;


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cover', { title: 'Express' });
});



router.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log(access_token);


        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          userId = body.id;
        });

        // we can also pass the token to the browser to make requests from there

        res.redirect('/dashboard');

       /* res.redirect('/playlists' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));*/
      } else {
        res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
      }
    });

  }
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
  spotifyApi.getUserPlaylists(userId)
      .then(function(data) {
        var response = (data.body.items);
        console.log('Retrieved playlists', data.body);
        //Response müssti in Databank gspeicheret werde und vo dere denn grenderet werde
        res.render('dashboard', {  data: response });
      },function(err) {
        console.log('Something went wrong!', err);
      });


});


router.post('/test', function(req,res){
  var requestPlaylist = req.body.id;
  console.log(req.body);
  router.get('/dashboard', function(req, res, next) {
    spotifyApi.getPlaylist(userId, requestPlaylist)
        .then(function(data) {
          var response = (data.body);
          console.log('Retrieved playlists', data.body);
          //Response müssti in Databank gspeicheret werde und vo dere denn grenderet werde
          res.render('dashboard', {  data: response });
        },function(err) {
          console.log('Something went wrong!', err);
        });


  });
});




module.exports = router;
