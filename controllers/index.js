const app = require('express').Router();
const { User, Post, Comment } = require('../models');

app.use('/api', require('./api'));

app.get('/posts/:id', async (req, res) => {
  try{
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'author' }],
      limit: 5,
      raw: true
    });

    const comments = await Comment.findAll({
      where: { post_id: req.params.id },
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    // If user is loggin in, and owns this post, set canEdit to true
    if(req.session.loggedIn && req.session.user_id === post.author_id)
      post.canEdit = true;

    res.render('post', {
      ...post,
      comments,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adding comments to post
app.post('/posts/:id', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    const comment = await Comment.create({
      content: req.body.content,
      author_id: req.session.user_id,
      post_id: req.params.id
    });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/login', async (req, res) => {
  try{
    if(req.session.loggedIn){
      res.redirect('/');
      return;
    }

    res.render('login');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/logout', async (req, res) => {
  try {
    res.render('loggingout', { 
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/posts', async (req, res) => {
  try{
    const posts = await Post.findAll({
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    res.render('posts', {
      posts,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/dashboard', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    const posts = await Post.findAll({
      include: [{ model: User, as: 'author' }],
      where: { author_id: req.session.user_id },
      raw: true
    });

    const user = await User.findByPk(req.session.user_id);

    res.render('dashboard', {
      posts,
      username: req.session.username,
      memberSince: user.createdAt,
      loggedIn: req.session.loggedIn
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/newpost', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    res.render('new-post', {
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/editpost/:id', async (req, res) => {
  try{
    // Check if user is logged in
    if(!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    const post = await Post.findByPk(req.params.id, {
      raw: true
    });

    // Check if user owns this post
    if(req.session.user_id !== post.author_id){
      res.redirect('/');
      return;
    }

    res.render('edit-post', {
      ...post,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', async (req, res) => {
  try{
    const posts = await Post.findAll({
      include: [{ model: User, as: 'author' }],
      raw: true
    });

    res.render('homepage', {
      posts,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;