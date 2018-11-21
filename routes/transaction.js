// Copyright (c) 2018, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

const express = require('express')
const router = express.Router()

/* GET transaction page. */
router.get('/', function(req, res, next) {

  res.render('transaction', { title: 'Transaction' })
})

/* GET transaction page. */
router.get('/check', function(req, res, next) {

  res.render('transaction_check', {
    title: 'Check',
  })
})


module.exports = router
