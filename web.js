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
  , User = models.User
  , Post = models.Post
  , bootstrap = require('./bootstrap')
  , CallbackAfterN = require('./src/CallbackAfterN')
  , express = require('express')
  , app = express.createServer()
  , bcrypt = require('bcrypt')
  , salt = '$2a$10$tXrtMGo98L.N58FUa6uGae';//bcrypt.gen_salt_sync(10)

bootstrap.init(models);
bootstrap.down();
bootstrap.up();

dummys.init(models);

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
    response.redirect('/');
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
        response.redirect('/post/crud');
        return;
      }
    }
    
    response.redirect('/#login');
  });
});

app.get('/logout', requiresLogin, function(request, response) {
  delete request.session.user;
  
  response.redirect('/');
});

app.get('/post/:sheet/:nr', function(request, response) {
  var sheet = request.params.sheet
    , nr = request.params.nr;
  
  Post
    .find({ published: true })
    .select('sheet', 'nr', 'title')
    .sort('sheet', 1, 'nr', 1)
  .run(function(error, posts) {
   
    if(error || posts == null) { posts = []; }
    
    var sidebar = [];
    var currentMenu = {};
    posts.forEach(function(post) {
      var item = { name: 'Fehlernummer ' + post.nr, link: '/post/' + post.sheet + '/' + post.nr };
      
      if(currentMenu.name != 'Blatt ' + post.sheet) {
        if(typeof(currentMenu.name) !== 'undefined') { sidebar.push(currentMenu); }
        
        currentMenu = {
          name: 'Blatt ' + post.sheet,
          items: [ item ]
        }
      } else {
        currentMenu.items.push(item);
      }
    });
    if(typeof(currentMenu.name) !== 'undefined') { sidebar.push(currentMenu); }
            
    Post.findOne({ sheet: sheet, nr: nr, published: true }, function(error, post) {

      if(error || post == null) {
        post = dummys.newPost(sheet, nr);
        author = dummys.newUser();

        response.render('post', { post: post, author: author });
      } else {
        User.findOne({ _id: post.author }, function(err, author) {

          if(err || author == null) {
            post = dummys.newPost(sheet, nr);
            author = dummys.newUser();
          }

          response.render('post', { post: post, author: author, sidebar: sidebar });
        });
      }
    });
  });
});

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

app.post('/post/update', requiresLogin, function(request, response) {
  Post.findById(request.param("id"), function(err, post) {
    // set published
    var published = false;
    if(request.param('published') == 'true') {
      published = true;
    }
    
    // set imports
    var imports = [];
    if(request.param("need.images")) {
      imports.push("images");
    }
    if(request.param("need.syntax-highlighting")) {
      imports.push("syntax-highlighting");
    }
    
    // set params
    var params = {
        title       : request.param('title'),
        description : request.param('description'),
        imports     : imports, 
        content     : request.param('content'),
        published   : published
    };
    
    if(request.param('sheet') != null && request.param('sheet') != "") {
      params.sheet = request.param('sheet');
    }
    
    if(request.param('nr') != null && request.param('nr') != "") {
      params.nr = request.param('nr');
    }
    
    post.set(params);
    
    // save to database
    post.save(function(err, savedPost) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      
      var error = null;
      if(err) { error = true;}
      else { error = false;}
      
      response.end(JSON.stringify({error: error, post: savedPost}));
    });
  });
});


app.get('/post/unpublished', requiresLogin, function(request, response) {
  var renderAfter2 = new CallbackAfterN({
    n: 2,
    callback: render
  });
  
  var sidebar = [
    { name: 'Publizierte Posts', items: [ { name: 'Alle anzeigen', link: '/post/published' } ] },
    { name: 'Nicht publizierte Posts', items: [ { name: 'Alle anzeigen', link: '/post/unpublished' } ] }
  ];
  
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
    response.render('post/crud', {
      authors: users,
      posts: posts,
      generatePostMarkup: generatePostMarkup,
      sidebar: sidebar 
    });
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
  new Post({
    published: false, 
    date: new Date(),
    author: request.session.user._id,
    title: "Neuer Post"
  }).save(function(err, post) {
    if(err) { err = true; } 
    else { err = false; }
    
    response.end(JSON.stringify({err: err, post: post}));
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
