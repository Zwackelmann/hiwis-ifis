var User = null;

module.exports = function(models) {
  User = models.User;
  
  down();
  up();
};

function down() {
  User.remove();
}

function up() {
  new User({ name: 'phil', password: '$2a$10$tXrtMGo98L.N58FUa6uGaebHK1oFDqWYIKhn4aCR3iKpYYBNvCT2i' }).save();
  new User({ name: 'simon', password: '$2a$10$tXrtMGo98L.N58FUa6uGae0S9OeO3I9T939k1/l0bWYw3pwxoqsHe' }).save();
}