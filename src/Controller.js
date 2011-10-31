var Controller = function(prefix, app) {
  function post(path, callback) {
    post.arguments[0] = prefix + post.arguments[0];
    app.post.apply(app, post.arguments);
  }
  
  function get() {
    get.arguments[0] = prefix + get.arguments[0];
    app.get.apply(app.get, get.arguments);
  }
  
  return {
    post: post,
    get: get
  };
};

module.exports = Controller;