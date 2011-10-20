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

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hiwis-ifis');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BlogPost = new Schema({
	author : ObjectId,
	title  : String,
	text   : String
});

var Comment = new Schema({
	name : {type: String},
	text : {type: String}
});

BlogPost = mongoose.model('BlogPost', BlogPost);
Comment = mongoose.model('Comment', Comment);

var post = new BlogPost();
post.title = "foobar";
post.text = "bazban";
post.save(function(err) {
	if(err) console.log(err);
});



var express = require('express')
  , app = express.createServer(
    express.cookieParser(),
    express.session({ secret: 'keyboard cat' })
  ),dom = require('express-jsdom')(app)
  , bcrypt = require('bcrypt');
  
  
app.configure(function() {
  app.use(express.static(__dirname + '/static'));
  app.use(express.logger());
});

var salt = bcrypt.gen_salt_sync(10);

var jquery = './aspects/jquery'
  , weldable = [ jquery, './aspects/weld', './aspects/jquery-weld' ];

app.get('/switch-user', function(request, response) {
  if(typeof(request.session.auth) === 'undefined') {
    var hash = bcrypt.encrypt_sync("123", salt);
    console.log(hash);
    request.session.auth = true;
  } else {
    delete request.session.auth;
  }
  response.redirect('/');
});

app.get('/', function(request, response) {  
  if(request.session.auth == true) {
    response.send('yay auth!');
  } else {
    response.send('me lost my auth:(');
  }
});

dom.get('/index', dom.parse, weldable, function($, window, response) {    
  window.document.title = 'hiwis@ifis';
  
  var newpost = {
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
  
  $('article#content').weld(newpost, { title: 'hgroup > h1', body: 'section' });
  
//$('.contacts > li').weld([
//  { name: 'hij1nx', title: 'code slayer' },
//  { name: 'tmpvar', title: 'code pimp' }
//],{ name: 'span',   title: 'p' });
//$('.content').weld('Der neue serverseitige Inhalt!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});