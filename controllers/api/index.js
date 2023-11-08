const api = require('express').Router();

api.use('/users', require('./user'));
api.use('/posts', require('./post'));

module.exports = api;