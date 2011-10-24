var User = null;
var Post = null;

var CallbackAfterN = require("./src/CallbackAfterN");

module.exports = function(models) {
  User = models.User;
  Post = models.Post;
  down();
};

function down() {
  var upAfter2 = new CallbackAfterN({
    n: 2,
    callback: up
  });
  
  User.remove({}, upAfter2.countdown());
  Post.remove({}, upAfter2.countdown());
}

function up() {
  var createPostsAfter2 = new CallbackAfterN({
    n: 2,
    callback: createPosts
  });
  
  function createPosts() {
    new Post({
      sheet       : 1,
      nr          : 1,
      title       : "simons post",
      author      : simon,
      description : "foobar",
      date        : new Date(),
      imports     : ["images", "syntax-highlighting"],
      content     : "bazban",
      comments    : [] ,
      published   : false
    }).save();
    
    new Post({
      sheet       : 2,
      nr          : 2,
      title       : "phils post",
      author      : phil,
      description : "description of phils post",
      date        : new Date(),
      imports     : ["1", "2"],
      content     : "content fo phils post",
      comments    : [],
      published   : false
    }).save();
    
    new Post({
      sheet       : 2,
      nr          : 1,
      title       : "phils published post",
      author      : phil,
      description : "description of phils published post",
      date        : new Date(),
      imports     : ["1", "2"],
      content     : "content fo phils published post",
      comments    : [],
      published   : true
    }).save();
  };
  
  var phil = null;
  var simon = null;
  new User({ name: 'phil', password: '$2a$10$tXrtMGo98L.N58FUa6uGaebHK1oFDqWYIKhn4aCR3iKpYYBNvCT2i' }).save(
    createPostsAfter2.countdown(function(err, user) {
      phil = user;
    })
  );
  
  new User({ name: 'simon', password: '$2a$10$tXrtMGo98L.N58FUa6uGae0S9OeO3I9T939k1/l0bWYw3pwxoqsHe' }).save(
    createPostsAfter2.countdown(function(err, user) {
      simon = user;
    })
  );
}



