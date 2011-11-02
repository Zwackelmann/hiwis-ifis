var post = new Controller('/post');

post.get('/:sheet/:nr', function(request, response) {
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
        };
      } else {
        currentMenu.items.push(item);
      }
    });
    if(typeof(currentMenu.name) !== 'undefined') { sidebar.push(currentMenu); }
            
    Post.findOne({ sheet: sheet, nr: nr, published: true }, function(error, post) {

      if(error || post == null) {
        post = dummys.newPost(sheet, nr);
        author = dummys.newUser();

        response.render('post', { post: post, author: author, sidebar: sidebar });
      } else {
        User.findOne({ _id: post.author }, function(err, author) {

          if(err || author == null) {
            post = dummys.newPost(sheet, nr);
            author = dummys.newUser();
          }
          
          var generateCommentMarkup = require('./../static/javascripts/markup_generators/comment');
          response.render('post', { post: post, author: author, sidebar: sidebar, generateCommentMarkup: generateCommentMarkup });
        });
      }
    });
  });
});

//post.get('/create', function(request, response) {
post.post('/', function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  new Post({
    published: false, 
    date: new Date(),
    author: request.session.user._id,
    title: 'Neuer Post'
  }).save(function(error, post) {
    if(error) { error = true; } 
    else { error = false; }
    
    response.end(JSON.stringify({ err: error, post: post }));
  });
});

//TODO: app.delete('/post/:id')
//post.get('/delete', Controller.requiresLogin, function(request, response) {
post.del('/', Controller.requiresLogin, function(request, response) {  
  Post.remove({ _id: request.param('id') }, function(error) {
    if(error) {
      error = true;
    } else {
      error = false;
    }
   
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ err: error }));
  });
});

function renderPosts(request, response, published) {
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
  Post.find({ published: published }).exec(renderAfter2.countdown(function(err, docs){
    posts = docs;
  }));
  
  function render() {
    var generatePostMarkup = require('./../static/javascripts/markup_generators/post');
    response.render('post/crud', {
      authors: users,
      posts: posts,
      published: published,
      generatePostMarkup: generatePostMarkup,
      sidebar: sidebar
    });
  }
}

post.get('/unpublished', Controller.requiresLogin, function(request, response) {
  renderPosts(request, response, false);
});

post.get('/published', Controller.requiresLogin, function(request, response) {
  renderPosts(request, response, true);
});

//TODO: app.put('/post/:id')
//post.post('/update', Controller.requiresLogin, function(request, response) {
post.put('/', Controller.requiresLogin, function(request, response) {
  Post.findById(request.param('id'), function(error, post) {
    // set published
    var published = false;
    if(request.param('published') == 'true') {
      published = true;
    }
    
    // set imports
    var imports = [];
    if(request.param('need.images')) {
      imports.push('images');
    }
    if(request.param('need.syntax-highlighting')) {
      imports.push('syntax-highlighting');
    }
    
    // set params
    var params = {
        title       : request.param('title'),
        description : request.param('description'),
        imports     : imports, 
        content     : request.param('content'),
        published   : published
    };
    
    if(request.param('sheet') != null && request.param('sheet') != '') {
      params.sheet = request.param('sheet');
    }
    
    if(request.param('nr') != null && request.param('nr') != '') {
      params.nr = request.param('nr');
    }
    
    post.set(params);
    
    // save to database
    post.save(function(error, savedPost) {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      
      if(error) { error = true; }
      else { error = false; }
      
      response.end(JSON.stringify({ error: error, post: savedPost }));
    });
  });
});

post.get('/failureNumber', Controller.requiresLogin, function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  Post.count({ sheet: request.param('sheet') }, function(error, count) {
    if(error) { error = true; } 
    else { error = false; }
    
    response.end(JSON.stringify({ err: error, nr: (count + 1) }));
  });  
});

module.exports = post;