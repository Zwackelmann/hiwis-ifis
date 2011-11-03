function generateCommentMarkup(comment) {
  var date = new Date(comment.date.toString());
  
  var markup = "" +
    "<section class='comment'>\n" +
    "    <time datetime='" + date.toString() + "' pubdate='pubdate'>\n" +
    "        " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "\n" +
    "    </time>\n" +
    "    <hgroup>\n" +
    "        <h2>" + comment.name + " schrieb:</h2>\n" +
    "    </hgroup>\n" +
    "    <div>\n" +
    "        <p>" + comment.content + "</p>\n" +
    "    </div>\n" +
    "</section>\n" +
  "";
  
  return markup;
}

if(typeof(module) !== 'undefined') {
  module.exports = generateCommentMarkup;
}