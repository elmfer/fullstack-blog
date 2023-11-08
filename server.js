const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions with cookies
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize })
};

// Add express-session and store as Express.js middleware
app.use(session(sess));

// Inform Express.js on which template engine to use
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use api routes
app.use(routes);

// Sync database and then start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Hosted on http://localhost:${PORT} if you're using a local server.`));
});