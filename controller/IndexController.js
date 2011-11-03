var index = new Controller();

index.get('/', function(request, response) {
  Post
    .find({ published: true })
    .select('sheet', 'nr')
    .sort('sheet', -1, 'nr', -1)
    .limit(1)
  .run(function(error, results) {
    var post = results[0]
      , sheet = post.sheet
      , nr = post.nr;
    
      response.redirect('/post/' + sheet + '/' + nr);
  });
});

['legalnotice', 'contact'].forEach(function(uri) {
  index.get('/' + uri, function(request, response) {
    response.render(uri, { footer: '' });
  });
});