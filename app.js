// Copyright (c) 2018, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const Helmet = require('helmet')
const Compression = require('compression')
const logger = require('morgan')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(Helmet())
app.use(Compression())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/block', require('./routes/block'))
app.use('/transaction', require('./routes/transaction'))
app.use('/pools', require('./routes/pools'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('include/error')
})

module.exports = app
