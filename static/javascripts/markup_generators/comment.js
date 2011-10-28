function generateCommentMarkup(comment) {
  var markup = "" +
  "<article class=\"comment\">" +
  "    " + comment.name + " schrieb am " + comment.date.toString() + "<br>" +
  "    " + comment.content +
  "</article>";
  
  return markup;
}

if(!(typeof module === 'undefined')) {
  module.exports = generateCommentMarkup;
}