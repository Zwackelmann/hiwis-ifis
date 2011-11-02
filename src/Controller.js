module.exports = function(app) {
  
  var Controller = function(prefix) {
    function post() {
      arguments = post.arguments;
      
      arguments[0] = prefix + arguments[0];
      app.post.apply(app, arguments);
    }
    
    function get() {
      arguments = get.arguments;
      
      arguments[0] = prefix + arguments[0];
      app.get.apply(app, arguments);
    }
    
    function put() {
      arguments = put.arguments;
      
      arguments[0] = prefix + arguments[0];
      app.put.apply(app, arguments);
    }
    
    function del() {
      arguments = del.arguments;
      
      arguments[0] = prefix + arguments[0];
      app.delete.apply(app, arguments);
    }
    
    return {
      post: post,
      get: get,
      put: put,
      del: del
    };
  };
  
  Controller.requiresLogin = function(request, response, next) {
    User.findOne({ name: 'simon' }, function(err, user) {
      request.session.user = user;
      next();
    });
    
    /*if(request.session.user) {
      next();
    } else {
      response.redirect('/');
    }*/
  }
  
  return Controller;
};