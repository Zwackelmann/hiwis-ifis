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
  PostSchema.methods.day = function() { return this.date.getDate(); };
  PostSchema.methods.month = function() { return this.date.getMonth() + 1; };
  PostSchema.methods.monthName = function() {
    var monthName = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ];
    return monthName[this.month() - 1];
  };
  PostSchema.methods.year = function() { return this.date.getFullYear(); };
  PostSchema.methods.datetime = function() { return this.year() + '-' + this.month() + '-' + this.day(); };
  
  mongoose.model('User', UserSchema);
  mongoose.model('Comment', CommentSchema);
  mongoose.model('Post', PostSchema);
  
  return {
    User: mongoose.model('User'),
    Comment: mongoose.model('Comment'),
    Post: mongoose.model('Post')
  };
};