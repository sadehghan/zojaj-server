require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authentication');
var feedsRouter = require('./routes/feeds');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/feeds', feedsRouter);

mongoose.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connect to mongodb'))
    .catch((error) => console.log(error.message));

module.exports = app;
