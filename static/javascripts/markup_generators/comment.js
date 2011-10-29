function generateCommentMarkup(comment) {
  var markup = "" +
    "<section class='comment'>\n" +
    "    <time datetime='" + comment.datetime() + "' pubdate='pubdate'>\n" +
    "        " + comment.day() + "/" + comment.month() + "/" + comment.year() + "\n" +
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

if(!(typeof module === 'undefined')) {
  module.exports = generateCommentMarkup;
}