// Copyright (c) 2018, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

const express = require('express')
const router = express.Router()

/* GET block page. */
router.get('/', function(req, res, next) {
  res.render('block', { title: 'Block' })
})

module.exports = router
