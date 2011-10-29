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
  CommentSchema.methods.day = day;
  CommentSchema.methods.month = month;
  CommentSchema.methods.monthName = monthName;
  CommentSchema.methods.year = year;
  CommentSchema.methods.datetime = datetime;
  
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
  PostSchema.methods.day = day;
  PostSchema.methods.month = month;
  PostSchema.methods.monthName = monthName;
  PostSchema.methods.year = year;
  PostSchema.methods.datetime = datetime;
  
  mongoose.model('User', UserSchema);
  mongoose.model('Comment', CommentSchema);
  mongoose.model('Post', PostSchema);
  
  return {
    User: mongoose.model('User'),
    Comment: mongoose.model('Comment'),
    Post: mongoose.model('Post')
  };
};

function day() {
  return this.date.getDate();
}

function month() {
  return this.date.getMonth() + 1;
}

function monthName() {
  var monthName = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ];
  return monthName[this.month() - 1];
}

function year() {
  return this.date.getFullYear();
}

function datetime() {
  return this.year() + '-' + this.month() + '-' + this.day();
}