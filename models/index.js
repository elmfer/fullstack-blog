const Comment = require('./Comment');
const Post = require('./Post');
const User = require('./User');

// Create associations
User.hasMany(Post, {
  foreignKey: 'author_id'
});

Post.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

User.hasMany(Comment, {
  foreignKey: 'author_id',
  as: 'comment'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  as: 'comments'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

Comment.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

module.exports = { Comment, Post, User };