var comment = new Controller('/comment');

//TODO: app.post('/comment')
comment.post('/create', function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  
  Post.findOne({_id: request.param("postId")}, function(err, post) {
    if(err) {
      response.end(JSON.stringify({err: err}));
    }
    
    post.comments.push(new Comment({
      name: request.param("name"),
      content: request.param("content"),
      date: new Date()
    }));
    
    post.save(function(err, post) {
      response.end(JSON.stringify({err: err, comment: post.comments[post.comments.length-1]}));
    });
  });
});

comment.get('/delete', Controller.requiresLogin, function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  
  Post.findOne({_id: request.param("postId")}, function(err, post) {
    post.comments.id(request.param("commentId")).remove();
    
    post.save(function(err, res) {
      response.end(JSON.stringify({err: err}));
    });
  });
});