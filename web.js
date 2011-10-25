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


app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'nyan cat' }));
  app.use(express.bodyParser());
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/static'));
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/admin', function(request, response) {  
  if(typeof(request.session.user) === 'undefined') {
    response.redirect('/login');
  } else {
    response.send('nyan nyan nyan nyan nyan nyan nyan nyan nyan!');
  }
});

app.get('/login', function(request, response) {
  response.render('login');
});

app.post('/auth', function(request, response) {
  var username = request.param('username');

  User.findOne({ name: username }, function(err, authuser) {
    
    if(authuser != null) {
      var password = request.param('password');
      if(bcrypt.compare_sync(password, authuser.password)) {
        request.session.user = authuser.name;
        response.redirect('/admin');
        return;
      } else { response.redirect('/login'); }
    } else { response.redirect('/login'); }
  });
});

app.get('/logout', function(request, response) {
  if(typeof(request.session.user) !== 'undefined') {
    delete request.session.user;
  }
  
  response.redirect('/login');
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
  
  response.render('index', { post: post });
});


app.post('/post/edit', function(request, response) {
  var imports = [];
  if(request.param("need.images")) {
    imports.push("images");
  }
  if(request.param("need.syntax-highlighting")) {
    imports.push("syntax-highlighting");
  }
  
  Post.findById(request.param("id"), function(err, post) {
    var published = false;
    if(request.param('published') == 'true') {
      published = true;
    }
    
    post.set({
      sheet       : request.param('sheet'),
      nr          : request.param('nr'),
      title       : request.param('title'),
      description : request.param('description'),
      date        : new Date(),
      imports     : imports, 
      content     : request.param('content'),
      published   : published
    });
    
    post.save(function(err, savedPost) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      
      var error = null;
      if(err) { error = true;}
      else { error = false;}
      
      response.end(JSON.stringify({error: error, post: savedPost}));
    });
  });
});

app.get('/post/create', function(request, response) {  
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
    var generatePostMarkup = require("./static/javascripts/markup_generators/post");
    response.render('post/create', {authors: users, posts: posts, generatePostMarkup: generatePostMarkup});
  }  
});



app.get('/getFailureNumber', function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  Post.count({sheet: request.param("sheet")}, function(err, count) {
    if(err) { err = true; } 
    else { err = false; }
    response.end(JSON.stringify({err: err, nr: (count + 1)}));
  });  
});

app.get('/createEmptyPost', function(request, response) {
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




