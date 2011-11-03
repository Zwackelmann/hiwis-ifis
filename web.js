// Config vars
var NODE_ENV;
if(typeof process.env.NODE_ENV == 'string' && process.env.NODE_ENV.toLowerCase() == 'production') {
  NODE_ENV = 'production';
} else {
  NODE_ENV = 'development';
}

NODE_ENV = 'production';

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
  app.use(express.methodOverride());
});

// Define some classes as globals
global.CallbackAfterN = require('./src/CallbackAfterN');
global.User = models.User;
global.Post = models.Post;
global.Comment = models.Comment;
global.Controller = require('./src/Controller')(app);
global.dummys = require('./models/dummys');


// Execute Bootstrap if node is in development mode
if(NODE_ENV == 'development') {
  var bootstrap = require('./bootstrap');
  
  bootstrap.init(models);
  bootstrap.down(function(){
    bootstrap.up();
  });
}

require('./controller/IndexController');
require('./controller/PostController');
require('./controller/CommentController');
require('./controller/SessionController');

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});