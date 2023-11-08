const Comment = require('./Comment');
const Post = require('./Post');
const User = require('./User');

// Create associations
User.hasMany(Post, {
  foreignKey: 'author_id',
  as: 'post'
});

Post.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'post'
});

User.hasMany(Comment, {
  foreignKey: 'author_id',
  as: 'comment'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  as: 'comment'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'comment'
});

module.exports = { Comment, Post, User };