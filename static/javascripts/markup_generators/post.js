if(!(typeof module === 'undefined')) {
  var $ = require('jquery');
}

function generatePostMarkup(post) {
  var defaults = {
      title: "",
      description: "",
      content: "",
      nr: "",
      sheet: "",
      imports: [],
      published: false
  };
  
  for(var key in defaults) {
    if(!post[key]) {
      post[key] = defaults[key];
    }
  }
  
  var date = new Date(post.date.toString());
  var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  
  var markup = "" +
  "<article class=\"post\">" +
  "    <a class=\"iconic\" href=\"#" + post._id + "_attributes\">p</a>" +
  "    <time datetime=\"" + date.toString() + "\" pubdate=\"pubdate\">" +
  "        <ul>" +
  "            <li>" + date.getDate() + "</li>" +
  "            <li>" + months[date.getMonth()] + "</li>" +
  "            <li>" + date.getFullYear() + "</li>" +
  "        </ul>" +
  "    </time>" +
  "    <hgroup>" +
  "        <h1><span data-content=\"title\">" + post.title + "</span><span data-content=\"altered\"></span></h1>" +
  "        <h2>" +
  "            Blatt <span data-content=\"sheet\">" + post.sheet + "</span>" +
  "             - Nr. <span data-content=\"nr\">" + post.nr + "</span>" +
  "        </h2>" +
  "    </hgroup>" +
  "    <section id=\"" + post._id + "_attributes\">" +
  "        <form id=\"" + post._id + "_form\" method=\"POST\" action=\"/post/edit\">" +
  "            <input type=\"hidden\" name=\"id\" value=\"" + post._id + "\" />" +
  "            <input type=\"hidden\" name=\"published\" value=\"" + post.published + "\" />" +
  "            <dl>" +
  "                <dt>Blatt:</dt>" +
  "                <dd>";
  
  var sheetDropdown = "<select name=\"sheet\" onChange=\"updateSheet($(this)); setAltered(getPost($(this)));\">";
  sheetDropdown += "<option value=\"-1\">&gt;&gt; wählen &lt;&lt;</option>";
  for(var i = 1; i <= 12; i++) {
    sheetDropdown += "<option value=\"" + i + "\"";
    if(i == post.sheet) {
      sheetDropdown += " selected='selected'";
    }
    sheetDropdown += ">Sheet " + i + "</option>";
  }
  sheetDropdown += "</select>";
  
  markup += sheetDropdown;
  
  markup += "" +
  "                </dd>" +
  "                <dt>Title:</dt>" +
  "                <dd><input type=\"text\" name=\"title\" value=\"" + post.title + "\" onChange=\"updateTitle($(this)); setAltered(getPost($(this)));\" /></dd>" +
  "                <dt>Beschreibung:</dt>" +
  "                <dd><input type=\"text\" name=\"description\" value=\"" + post.description + "\" onChange=\"setAltered(getPost($(this)));\"/></dd>" +
  "                <dt>Bibliotheken:</dt>" +
  "                <dd>" +
  "                    <a class=\"iconic\" href=\"#" + post._id + "_content\">1</a>" +
  "                    <ul>" +
  "                        <li><input type=\"checkbox\" name=\"need.images\" " + ((post.imports.indexOf('images') != -1) ? 'checked' : '') + " onChange=\"setAltered(getPost($(this)));\"/> Bilder</li>" +
  "                        <li><input type=\"checkbox\" name=\"need.syntax-highlighting\" " + ((post.imports.indexOf('syntax-highlighting') != -1) ? 'checked' : '') + " onChange=\"setAltered(getPost($(this)));\"/> Syntax Highlighting</li>" +
  "                    </ul>" +
  "                </dd>" +
  "                <dt>&nbsp;</dt>" +
  "                <dd>" +
  "                    <input type=\"button\" onClick=\"save(getPost($(this)))\" value=\"speichern\" />" +
  "                    <input type=\"button\" onClick=\"publish(getPost($(this)))\" value=\"publizieren\" />" +
  "                </dd>" +
  "            </dl>" +
  "        </form>" +
  "    </section>" +
  "    <section id=\"" + post._id + "_content\">" +
  "        <textarea form=\"" + post._id + "_form\" name=\"content\" placeholder=\"Post description\" onChange=\"setAltered(getPost($(this)));\">" + post.content + "</textarea>" +
  "    </section>" +
  "</article>";
  
  return markup;
}

if(!(typeof module === 'undefined')) {
  module.exports = generatePostMarkup;
}