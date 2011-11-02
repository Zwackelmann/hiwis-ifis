var session = new Controller('/session');

var bcrypt = require('bcrypt')
  , salt = '$2a$10$tXrtMGo98L.N58FUa6uGae';//bcrypt.gen_salt_sync(10)

session.get('/logout', Controller.requiresLogin, function(request, response) {
  delete request.session.user;
  
  response.redirect('/');
});

session.post('/auth', function(request, response) {
  var username = request.param('username');

  User.findOne({ name: username }, function(err, authuser) {
    if(authuser != null) {
      var password = request.param('password');
      if(bcrypt.compare_sync(password, authuser.password)) {
        request.session.user = authuser;
        response.redirect('/post/unpublished');
        return;
      }
    }
    
    response.redirect('/#login');
  });
});