const api = require('express').Router();

api.use('/users', require('./user'));

module.exports = api;