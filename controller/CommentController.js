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

// TODO: comment.delete(...)
comment.get('/delete', Controller.requiresLogin, function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  var postId = request.param("postId");
  if(postId == null) {
    console.log("Error while removing a comment: Post id was null!");
    response.end();
    return;
  }
  
  Post.findOne({_id: postId}, function(err, post) {
    var commentId = request.param("commentId")
      , comment = post.comments.id(commentId);
    
    if(comment == null) {
      console.log("Error while removing a comment: Comment with id " + commentId + " not found!");
      response.end();
      return;
    }
    
    comment.remove();
    post.save(function(err, res) {
      response.end(JSON.stringify({err: err}));
    });
  });
});