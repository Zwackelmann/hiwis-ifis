var exports = function(app, models) { 
  var Controller = require('./../src/Controller.js');
  var PostController = new Controller('/post', app);
  
  
  PostController.post('/create', function(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    new models.Post({
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
};

module.exports = exports;