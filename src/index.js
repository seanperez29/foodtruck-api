import http from 'http'; //object that let's us create a server
import express from 'express'; //framework to build api's and handle requests
import bodyParser from 'body-parser'; //allows us to parse json out of request object
import mongoose from 'mongoose'; //interface with mongodb in elegant way
import config from './config';
import routes from './routes';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

let app = express();
app.server = http.createServer(app);

// middleware
//parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

// passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// api routes v1
app.use('/v1', routes);
app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);
export default app;
