const app = require('express').Router();
const { User, Post } = require('../models');

app.use('/api', require('./api'));

app.get('/posts/:id', async (req, res) => {
  try{
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'author' }],
      limit: 5,
      raw: true
    });

    res.render('post', {
      ...post,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
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

    console.log(req.session.loggedIn);

    res.render('posts', {
      posts,
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