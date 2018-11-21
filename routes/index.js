// Copyright (c) 2018, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

const express = require('express')
const router = express.Router()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TurtleCoin Block Explorer' })
})

module.exports = router
