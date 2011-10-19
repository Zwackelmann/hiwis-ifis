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
  , app = express.createServer()
  , dom = require('express-jsdom')(app);
  
app.configure(function() {
  app.use(express.static(__dirname + '/static'));
  app.use(express.logger());
});

var jquery = './aspects/jquery'
  , weldable = [ jquery, './aspects/weld', './aspects/jquery-weld' ];

app.get('/', function(request, response) {
  response.redirect('/index');
});

dom.get('/index', dom.parse, weldable, function($, window, response) {    
  window.document.title = 'Hello World';
  
  $('.contacts > li').weld([
    { name: 'hij1nx', title: 'code slayer' },
    { name: 'tmpvar', title: 'code pimp' }
  ],{ name: 'span',   title: 'p' });
  $('.content').weld('Der neue serverseitige Inhalt!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});