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
  
  var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var date = new Date(post.date.toString());
  
  var markup = "" +
  "<article class=\"post\">" +
  "    <a class=\"iconic\" href=\"javascript:\" onClick=\"remove(getPost($(this)))\">x</a>" +
  "    <a class=\"iconic\" href=\"#" + post._id + "_attributes\">p</a>" +
  "    <time datetime=\"" + date.toString() + "\" pubdate=\"pubdate\">" +
  "        <ul>" +
  "            <li>" + date.getDate() + "</li>" +
  "            <li>" + months[date.getMonth()] + "</li>" +
  "            <li>" + date.getFullYear() + "</li>" +
  "        </ul>" +
  "    </time>" +
  "    <hgroup>" +
  "        <h1>" +
  "            <span data-content=\"title\">" + post.title + "</span>" +
  "            <span data-content=\"altered\"></span></h1>" +
  "        <h2>" +
  "            Blatt <span data-content=\"sheet\">" + (post.sheet == null || post.sheet == "" ? "N/A" : post.sheet) + "</span>" +
  "             - Nr. <span data-content=\"nr\">" + (post.nr == null || post.sheet == "" ? "N/A" : post.nr) + "</span>" +
  "        </h2>" +
  "    </hgroup>" +
  "    <section id=\"" + post._id + "_attributes\">" +
  "        <form id=\"" + post._id + "_form\" method=\"POST\" action=\"/post/update\">" +
  "            <input type=\"hidden\" name=\"id\" value=\"" + post._id + "\" />" +
  "            <input type=\"hidden\" name=\"published\" value=\"" + post.published + "\" />" +
  "            <input type=\"hidden\" name=\"nr\" value=\"" + post.nr + "\" />" +
  "            <dl>" +
  "                <dt>Blatt:</dt>" +
  "                <dd>";
  
  var sheetDropdown = "<select name=\"sheet\" onChange=\"updateSheet($(this));\">";
  sheetDropdown += "<option value=\"\">&gt;&gt; wählen &lt;&lt;</option>";
  for(var i = 1; i <= 12; i++) {
    sheetDropdown += "<option value=\"" + i + "\"";
    if(post.sheet == i) {
      sheetDropdown += " selected='selected'";
    }
    sheetDropdown += ">Blatt " + i + "</option>";
  }
  sheetDropdown += "</select>";
  
  markup += sheetDropdown;
  
  markup += "" +
  "                </dd>" +
  "                <dt>Title:</dt>" +
  "                <dd><input type=\"text\" name=\"title\" value=\"" + post.title + "\" onChange=\"updateTitle($(this));\" /></dd>" +
  "                <dt>Beschreibung:</dt>" +
  "                <dd><input type=\"text\" name=\"description\" value=\"" + post.description + "\" \"/></dd>" +
  "                <dt>Bibliotheken:</dt>" +
  "                <dd>" +
  "                    <a class=\"iconic\" href=\"#" + post._id + "_content\">1</a>" +
  "                    <ul>" +
  "                        <li><input type=\"checkbox\" name=\"need.images\" " + ((post.imports.indexOf('images') != -1) ? 'checked' : '') + " /> Bilder</li>" +
  "                        <li><input type=\"checkbox\" name=\"need.syntax-highlighting\" " + ((post.imports.indexOf('syntax-highlighting') != -1) ? 'checked' : '') + " /> Syntax Highlighting</li>" +
  "                    </ul>" +
  "                </dd>" +
  "                <dt>&nbsp;</dt>" +
  "                <dd>" +
  "                    <input type=\"button\" onClick=\"save(getPost($(this)))\" value=\"speichern\" />";
  
  if(!post.published) {
    markup += "<input type=\"button\" onClick=\"publish(getPost($(this)))\" value=\"publizieren\" />";
  } else {
    markup += "<input type=\"button\" onClick=\"unpublish(getPost($(this)))\" value=\"depublizieren\" />";
  }
  
  markup += "" +
  "                </dd>" +
  "            </dl>" +
  "        </form>" +
  "    </section>" +
  "    <section id=\"" + post._id + "_content\">" +
  "        <ul class='dropme'>" +
  "            <li><a href='javascript:return false;' data-markup='<p></p>'>&#182;</a></li>" +
  "            <li><a href='javascript:return false;'>h2</a></li>" +
  "        </ul>" +
  "        <textarea form=\"" + post._id + "_form\" name=\"content\" placeholder=\"Post description\">" + post.content + "</textarea>" +
  "    </section>" +
  "</article>";
  
  return markup;
}

if(!(typeof module === 'undefined')) {
  module.exports = generatePostMarkup;
}