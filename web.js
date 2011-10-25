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
  , User = models.User
  , Post = models.Post
  , bootstrap = require('./bootstrap')(models)
  , CallbackAfterN = require('./src/CallbackAfterN')
  , express = require('express')
  , app = express.createServer()
  , bcrypt = require('bcrypt')
  , salt = '$2a$10$tXrtMGo98L.N58FUa6uGae';//bcrypt.gen_salt_sync(10)

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

function requiresLogin(request, response, next) {
  if(request.session.user) {
    next();
  } else {
    response.redirect('/#login');
  }
}

app.get('/admin', requiresLogin, function(request, response) {
  response.render('nyan');
});

app.post('/auth', function(request, response) {
  var username = request.param('username');

  User.findOne({ name: username }, function(err, authuser) {
    
    if(authuser != null) {
      var password = request.param('password');
      if(bcrypt.compare_sync(password, authuser.password)) {
        request.session.user = authuser;
        response.redirect('/post/create2');
        return;
      }
    }
    
    response.redirect('/#login');
  });
});

app.get('/logout', requiresLogin, function(request, response) {
  delete request.session.user;
  
  response.redirect('/#login');
});

app.get('/', function(request, response) {
  
  var post = {
    title: 'Ein toller Post!',
    body: "" +
      "<h2 id='syntax'>" +
        "<a href='#syntax'>SQL Syntax Highlighting</a>" +
      "</h2>" +
      "<pre class='brush:sql'>\n" +
        "\n" +
        "+      o     +              o   \n" +
        "    +             o     +       +\n" +
        "o          +\n" +
        "    o  +           +        +\n" +
        "+        o     o       +        o\n" +
        "-_-_-_-_-_-_-_,------,      o \n" +
        "_-_-_-_-_-_-_-|   /\\_/\\  \n" +
        "-_-_-_-_-_-_-~|__( ^ .^)  +     +  \n" +
        '_-_-_-_-_-_-_-""  ""      ' + "\n" +
        "+      o         o   +       o\n" +
        "    +         +\n" +
        "o        o         o      o     +\n" +
        "    o           +\n" +
        "+      +     o        o      +\n" +
        "\n" +
        "CREATE TABLE IP_V4_Adresses (\n" +
        "    one int, two int, three int, four int,\n" +
        "    PRIMARY KEY (one, two, three, four),\n" +
        "    CONSTRAINT firstTopBorderCheck     CHECK(one <= 255),\n" +
        "    CONSTRAINT firstBottomBorderCheck  CHECK(one >= 0),\n" +
        "    CONSTRAINT secondTopBorderCheck    CHECK(two <= 255),\n" +
        "    CONSTRAINT secondBottomBorderCheck CHECK(two >= 0),\n" +
        "    CONSTRAINT thirdTopBorderCheck     CHECK(three <= 255),\n" +
        "    CONSTRAINT thirdBottomBorderCheck  CHECK(three >= 0),\n" +
        "    CONSTRAINT fourthTopBorderCheck    CHECK(four <= 255),\n" +
        "    CONSTRAINT fourthBottomBorderCheck CHECK(four >= 0)\n" +
        ");" +
      "</pre>" +
    ""
  };
  
  //$('article#content').weld(newpost, { title: 'hgroup > h1', body: 'section' });
  
  response.render('index');
});

app.post('/post/edit', requiresLogin, function(request, response) {
  var imports = [];
  if(request.param("need.images")) {
    imports.push("images");
  }
  if(request.param("need.syntax-highlighting")) {
    imports.push("syntax-highlighting");
  }
  
  Post.findById(request.param("id"), function(err, post) {
    post.set({
      sheet       : request.param('sheet'),
      nr          : request.param('nr'),
      title       : request.param('title'),
      description : request.param('description'),
      date        : new Date(),
      imports     : imports, 
      content     : request.param('content')
    });
    post.save();
    
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end("{}");
  });
});

app.get('/post/create', requiresLogin, function(request, response) {
  var renderAfter2 = new CallbackAfterN({
    n: 2,
    callback: render
  });
  
  var users = null;
  User.find({}).exec(renderAfter2.countdown(function(err, docs){
    users = docs;
  }));
  
  var posts = null;
  Post.find({ published: false }).exec(renderAfter2.countdown(function(err, docs){
    posts = docs;
  }));
  
  function render() {
    response.render('post/create', {authors: users, posts: posts});
  }  
});




app.get('/post/create2', requiresLogin, function(request, response) {
  var renderAfter2 = new CallbackAfterN({
    n: 2,
    callback: render
  });
  
  var users = null;
  User.find({}).exec(renderAfter2.countdown(function(err, docs){
    users = docs;
  }));
  
  var posts = null;
  Post.find({ published: false }).exec(renderAfter2.countdown(function(err, docs){
    posts = docs;
  }));
  
  function render() {
    response.render('post/create2', { authors: users, posts: posts });
  }  
});




app.get('/getFailureNumber', requiresLogin, function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  Post.count({sheet: request.param("sheet")}, function(err, count) {
    if(err) { err = true; } 
    else { err = false; }
    response.end(JSON.stringify({err: err, nr: (count + 1)}));
  });  
});

app.get('/createEmptyPost', requiresLogin, function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  new Post({}).save(function(err, post) {
    if(err) { err = true; } 
    else { err = false; }
    response.end(JSON.stringify({err: err, post: post}));
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});