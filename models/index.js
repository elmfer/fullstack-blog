const Comment = require('./comment');
const Post = require('./post');
const User = require('./user');

// Create associations
User.hasMany(Post, {
  foreignKey: 'author_id'
});

Post.belongsTo(User, {
  foreignKey: 'author_id'
});

User.hasMany(Comment, {
  foreignKey: 'author_id'
});

Comment.belongsTo(User, {
  foreignKey: 'author_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

module.exports = { Comment, Post, User };