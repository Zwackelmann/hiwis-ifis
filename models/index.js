module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;
  
  var UserSchema = new Schema({
    name     : String,
    password : String
  });
  
  var CommentSchema = new Schema({
    name    : String,
    content : String,
    date    : Date
  });
  
  var PostSchema = new Schema({
    sheet       : Number,
    nr          : Number,
    title       : String,
    author      : ObjectId,
    description : String,
    date        : Date,
    imports     : [String],
    content     : String,
    comments    : [CommentSchema],
    published   : Boolean
  });
  
  mongoose.model('User', UserSchema);
  mongoose.model('Comment', CommentSchema);
  mongoose.model('Post', PostSchema);
  
  return {
    User: mongoose.model('User'),
    Comment: mongoose.model('Comment'),
    Post: mongoose.model('Post')
  };
};