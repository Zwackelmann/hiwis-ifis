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

var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/hiwis-ifis', function(err){if(err)console.log(err);})
  , models = require('./models')(db)
  , dummys = require('./models/dummys')
  , express = require('express')
  , app = express.createServer();

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

global.CallbackAfterN = require('./src/CallbackAfterN');
global.User = models.User;
global.Post = models.Post;
global.Comment = models.Comment;
global.Controller = require('./src/Controller')(app);


dummys.init(models);
var bootstrap = require('./bootstrap');

bootstrap.init(models);
bootstrap.down(function(){
  bootstrap.up();
});

global.dummys = dummys;

require('./controller/IndexController');
require('./controller/PostController');
require('./controller/CommentController');
require('./controller/SessionController');

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});