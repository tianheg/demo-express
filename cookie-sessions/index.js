'use strict'

/**
 * Module dependencies.
 */

const express = require('express')
const cookieSession = require('cookie-session')

const app = express()

// add req.session cookie support
app.use(cookieSession({ secret: 'sth is cool'}))

// do something with the session
app.use(count)

// custom middleware
function count(req, res) {
  req.session.count = (req.session.count || 0) + 1
  res.send(`viewed ${req.session.count} times\n`)
}

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
