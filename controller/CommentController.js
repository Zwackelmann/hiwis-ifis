var comment = new Controller('/comment');

comment.post('/', function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  
  Post.findOne({ _id: request.param('postId') }, function(error, post) {
    if(error) {
      response.end(JSON.stringify({ err: error })); // TODO: Do we need a "return" here?
    }
    
    post.comments.push(new Comment({
      name: request.param('name'),
      content: request.param('content'),
      date: new Date()
    }));
    
    post.save(function(error, post) {
      response.end(JSON.stringify({ err: error, comment: post.comments[post.comments.length - 1] }));
    });
  });
});

comment.del('/', Controller.requiresLogin, function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  var postId = request.param('postId');
  if(postId == null) {
    console.log('Error while removing a comment: Post id was null!');
    response.end();
    return;
  }
  
  Post.findOne({ _id: postId }, function(error, post) {
    var commentId = request.param('commentId')
      , comment = post.comments.id(commentId);
    
    if(comment == null) { // TODO: If error?
      console.log('Error while removing a comment: Comment with id ' + commentId + ' not found!');
      response.end();
      return;
    }
    
    comment.remove();
    post.save(function(error, res) {
      response.end(JSON.stringify({ err: error }));
    });
  });
});