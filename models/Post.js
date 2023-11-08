const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Post extends Model {};

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      onDelete: 'cascade'
    }
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;