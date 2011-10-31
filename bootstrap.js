//var User = null;
//var Post = null;
//var Comment = null;

var CallbackAfterN = require("./src/CallbackAfterN");

function init(models) {
  //User = models.User;
  //Post = models.Post;
  //Comment = models.Comment;
};

function down(callback) {
  var upAfter2 = new CallbackAfterN({
    n: 2,
    callback: callback
  });
  
  User.remove({}, upAfter2.countdown());
  Post.remove({}, upAfter2.countdown());
}

function up() {
  var createPostsAfter2 = new CallbackAfterN({
    n: 2,
    callback: createPosts
  });
  
  var phil = null;
  var simon = null;
  new User({ name: 'phil', password: '$2a$10$tXrtMGo98L.N58FUa6uGaebHK1oFDqWYIKhn4aCR3iKpYYBNvCT2i' }).save(
    createPostsAfter2.countdown(function(err, user) { phil = user; })
  );
  
  new User({ name: 'simon', password: '$2a$10$tXrtMGo98L.N58FUa6uGae0S9OeO3I9T939k1/l0bWYw3pwxoqsHe' }).save(
    createPostsAfter2.countdown(function(err, user) { simon = user; })
  );
  
  function createPosts() {
    new Post({
      sheet       : 1,
      nr          : 1,
      title       : "IPV4 Adressen sind schon schwer",
      author      : simon,
      description : "Wanky Schema für IPV4 Adressen. Richtig wäre:",
      date        : new Date(2011, 9, 25, 12, 30, 34),
      imports     : ["syntax-highlighting"],
      content     : '' +
        '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>' + "\n" +
        '<h2 id="syntax"><a href="#syntax">SQL Syntax Highlighting</a></h2>' + "\n" +
        '<pre class="brush:sql">' + "\n" +
        '    CREATE TABLE IP_V4_Adresses (' + "\n" +
        '	    one int, two int, three int, four int,' + "\n" +
        '	    PRIMARY KEY (one, two, three, four),' + "\n" +
        '	    CONSTRAINT firstTopBorderCheck     CHECK(one <= 255),' + "\n" +
        '	    CONSTRAINT firstBottomBorderCheck  CHECK(one >= 0),' + "\n" +
        '	    CONSTRAINT secondTopBorderCheck    CHECK(two <= 255),' + "\n" +
        '	    CONSTRAINT secondBottomBorderCheck CHECK(two >= 0),' + "\n" +
        '	    CONSTRAINT thirdTopBorderCheck     CHECK(three <= 255),' + "\n" +
        '	    CONSTRAINT thirdBottomBorderCheck  CHECK(three >= 0),' + "\n" +
        '	    CONSTRAINT fourthTopBorderCheck    CHECK(four <= 255),' + "\n" +
        '	    CONSTRAINT fourthBottomBorderCheck CHECK(four >= 0)' + "\n" +
        '	);' + "\n" +
        '</pre>' + "\n" +
      '',
      comments    : [ new Comment({name: 'bert', content: 'foobar', date: new Date()}) ],
      published   : true
    }).save();
    
    new Post({
      sheet       : 1,
      nr          : 2,
      title       : "Das View für IPV4 Adressen",
      author      : phil,
      description : "Hier muss das richtige View für IPV4 Adressen rein!",
      date        : new Date(2011, 9, 25, 13, 37, 0),
      imports     : ["syntax-highlighting"],
      content     : '' +
        '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>' + "\n" +
        '<h2 id="syntax"><a href="#syntax">SQL Syntax Highlighting</a></h2>' + "\n" +
        '<pre class="brush:sql">' + "\n" +
        '    CREATE VIEW IP_V4_Adresses_View AS' + "\n" +
        '    SELECT (' + "\n" +
        "    		CAST(one   AS Varchar(3)) || X'2E' ||\n" +
        "    		CAST(two   AS Varchar(3)) || X'2E' ||\n" +
        "    		CAST(three AS Varchar(3)) || X'2E' ||\n" +
        '    		CAST(four  AS Varchar(3))' + "\n" +
        '    ) AS IP_V4_Adresse' + "\n" +
        '    FROM IP_V4_Adresses;' + "\n" +
        '</pre>' + "\n" +
      '',
      comments    : [
        new Comment({name: 'Arne', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?', date: new Date()}),
        new Comment({name: 'Dominik', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit!', date: new Date()}),
        new Comment({name: 'Yord', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.:)', date: new Date()})
      ],
      published   : true
    }).save();
    
    new Post({
      sheet       : 2,
      nr          : 1,
      title       : "Connection zur Datenbank mit JDBC",
      author      : phil,
      description : "Naja, ne connection aufsetzen halt...",
      date        : new Date(2011, 9, 26, 9, 3, 47),
      imports     : ["syntax-highlighting"],
      content     : '' +
        '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>' + "\n" +
        '<h2 id="syntax"><a href="#syntax">SQL Syntax Highlighting</a></h2>' + "\n" +
        '<pre class="brush:java">' + "\n" +
        '    try {' + "\n" +
        '      	Class.forName("com.ibm.db2.jcc.DB2Driver");' + "\n" +
        '      	Connection connection = DriverManager.getConnection(' + "\n" +
        '      	    "jdbc:db2://is54.idb.cs.tu-bs.de:50000/SQLKURS",' + "\n" +
        '      	    "skurs69",' + "\n" +
        '      	    "geheim"' + "\n" +
        '        );' + "\n" +
        '    }' + "\n" +
        '    catch (ClassNotFoundException e) {}' + "\n" +
        '    catch (SQLException s) {}' + "\n" +
        '</pre>' + "\n" +
      '',
      comments    : [],
      published   : false
    }).save();
  }
}

module.exports.init = init;
module.exports.down = down;
module.exports.up = up;