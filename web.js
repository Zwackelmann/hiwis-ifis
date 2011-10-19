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

var express = require('express');
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

var BlogPost = mongoose.model('BlogPost', BlogPost);
var Comment = mongoose.model('Comment', Comment);

var post = new BlogPost();
post.title = "foobar";
post.text = "bazban";
post.save(function(err) {
	if(err) console.log(err);
});

var app = express.createServer(express.logger());
app.get('/', function(request, response) {
  response.send('Hello World!');
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

