var Post = null;
var User = null;

function init(models) {
  Post = models.Post;
  User = models.User;
};

function newUser() {
   return new User({ name: 'nopony' });
};

function newPost(sheet, nr) {
  return new Post({
    sheet: sheet,
    nr: nr,
    title: 'Fehler: Kein Eintrag gefunden!',
    author: newUser(),
    date: new Date(),
    content: '' +
      '<p>' + 
        'Für das Blatt "'+sheet+'" und die Fehlernummer "'+nr+'" existiert kein Eintrag im System!' +
      '</p>' +
    ''
  });
};

module.exports.init = init;
module.exports.newUser = newUser;
module.exports.newPost = newPost;