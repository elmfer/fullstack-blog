const postRouter = require('express').Router();
const { Post, User, Comment } = require('../../models');

// Get all posts
postRouter.get('/', async (req, res) => {
  try{
    const posts = await Post.findAll({
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single post
postRouter.get('/:id', async (req, res) => {
  try{
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    const comments = await Comment.findAll({
      where: { post_id: req.params.id },
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    res.json({ ...post, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
postRouter.post('/', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author_id: req.session.user_id
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post
postRouter.put('/:id', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    // Check if user owns post
    let post = await Post.findByPk(req.params.id);
    if(post.author_id !== req.session.user_id){
      res.status(403).json({ message: 'You do not have permission to update this post!' });
      return;
    }

    post = await Post.update(req.body, {
      where: { id: req.params.id }
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
postRouter.delete('/:id', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    // Check if user owns post
    let post = await Post.findByPk(req.params.id);
    if(post.author_id !== req.session.user_id){
      res.status(403).json({ message: 'You do not have permission to delete this post!' });
      return;
    }

    post = await Post.destroy({
      where: { id: req.params.id }
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = postRouter;