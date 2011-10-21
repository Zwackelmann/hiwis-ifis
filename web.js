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
  , bootstrap = require('./bootstrap')(models)
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
  
  //$('article#content').weld(newpost, { title: 'hgroup > h1', body: 'section' });
  
  response.render('index', { post: post });
});

app.get('/post/create', function(request, response) {
  response.render('post/create');
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});