const userRouter = require('express').Router();
const { User, Post } = require('../../models');

userRouter.get('/', async (req, res) => {
  try{
    const users = await User.findAll({
      include: [{ model: Post, attributes: { exclude: ['content'] } }],
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.get('/:id', async (req, res) => {
  try{
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Post, attributes: { exclude: ['content'] } }],
      attributes: { exclude: ['password'] }
    });

    // If user was not found, send 404
    if(!user){
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/', async (req, res) => {
  try{
    // Check to see if username and password were provided
    if(!req.body.username || !req.body.password){
      res.status(400).json({ message: 'Username and password are required!' });
      return;
    }

    const newUser = await User.create(req.body);

    // Save the session
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.status(200).redirect('/');
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/login', async (req, res) => {
  try{
    // Check to see if username and password were provided
    if(!req.body.username || !req.body.password){
      res.status(400).json({ message: 'Username and password are required!' });
      return;
    }

    const user = await User.findOne({ where: { username: req.body.username } });

    // If user was not found, send 404
    if(!user){
      res.status(404).json({ message: 'No user found with this username!' });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    // If password is invalid, send 400
    if(!validPassword){
      res.status(400).json({ message: 'Invalid password!' });
      return;
    }

    // Save the session
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.status(200).json({ message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/logout', async (req, res) => {
  try{
    // If user is not logged in, send 400
    if(!req.session.loggedIn){
      res.status(400).json({ message: 'You are not logged in!' });
      return;
    }

    // Destroy the session
    req.session.destroy(() => {
      res.status(200).json({ message: 'You are now logged out!' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete('/:id', async (req, res) => {
  try{
    // Check to see if authorized
    if(req.header('admin-key') !== process.env.ADMIN_KEY){
      res.status(403).json({ message: 'You are not authorized to do that!' });
      return;
    }

    const user = await User.findByPk(req.params.id);

    // If user was not found, send 404
    if(!user){
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;