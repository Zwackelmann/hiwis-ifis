/*
 * git init
 * git add .
 * git commit -a -m "init"
 * heroku create --stack cedar
 * git push heroku master
 * heroku ps:scale web=1
 * heroku ps
 * heroku config:add NODE_ENV=production
 */

// Config vars
var NODE_ENV;
if(typeof process.env.NODE_ENV == 'string' && process.env.NODE_ENV.toLowerCase() == 'production') {
  NODE_ENV = 'production';
} else {
  NODE_ENV = 'development';
}

var database_url = process.env.DATABASE_URL || 'mongodb://localhost/hiwis-ifis';

// Initialize modules
var mongoose = require('mongoose')
  , db = mongoose.connect(database_url, function(err){if(err)console.log(err);})
  , models = require('./models')(db)
  , express = require('express');

// Create and Configure Server
app = express.createServer();
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'nyan cat' }));
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  
  app.use(express.logger());
  app.use(express.methodOverride()); // TODO: Really use it
});

// Define some classes as globals
global.CallbackAfterN = require('./src/CallbackAfterN');
global.User = models.User;
global.Post = models.Post;
global.Comment = models.Comment;
global.Controller = require('./src/Controller')(app);


// Execute Bootstrap if node is in development mode
if(NODE_ENV == 'development') {
  var dummys = require('./models/dummys');
  dummys.init(models);
  var bootstrap = require('./bootstrap');
  
  bootstrap.init(models);
  bootstrap.down(function(){
    bootstrap.up();
  });
  
  global.dummys = dummys;
}

// Initialize Controllers
var PostController = require('./controller/PostController');
var CommentController = require('./controller/CommentController');
var SessionController = require('./controller/SessionController');

// define some default pages
app.get('/', function(request, response) {
  Post
    .find({ published: true })
    .select('sheet', 'nr')
    .sort('sheet', -1, 'nr', -1)
    .limit(1)
  .run(function(error, results) {
    var post = results[0]
      , sheet = post.sheet
      , nr = post.nr;
    
      response.redirect('/post/' + sheet + '/' + nr);
  });
});

['legalnotice', 'contact'].forEach(function(uri) {
  app.get('/' + uri, function(request, response) {
    response.render(uri, { footer: '' });
  });
});

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});