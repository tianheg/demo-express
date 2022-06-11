'use strict'

/**
 * Module dependencies.
 */

const express = require('express')
const hash = require('pbkdf2-password')()
// 代码写完，始终不能登录，检查了几遍才发现，这句的最后还需要 `()`
const path = require('path')
const session = require('express-session')

const app = express()

// config

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// middleware

app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret'
}))

// Session-persisted message middleware

app.use(function (req, res, next) {
  const err = req.session.error
  const msg = req.session.success
  delete req.session.error
  delete req.session.success
  res.locals.message = ''
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>'
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>'
  next()
})

// dummy database

const users = {
  tj: { name: 'tj' }
}

// when you create a user, generate a salt
// and hash the password ('foobar' is pass here)

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
  if (err) throw err
  // store the salt & hash in the 'db'
  users.tj.salt = salt
  users.tj.hash = hash
})

// Authenticate using plain-object database

function authenticate(name, pass, fn) {
  // 这个 fn 是什么，可能是回调函数
  // https://nodejs.org/dist/latest-v16.x/docs/api/modules.html#accessing-the-main-module
  if (!module.parent) console.log('authenticating %s:%s', name, pass)
  const user = users[name]
  // query db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err)
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.session.error = 'Access denied!'
    res.redirect('/login')
  }
}

app.get('/', function(req, res) {
  res.redirect('/login')
})

app.get('/restricted', restrict, function(req, res) {
  res.send('Wahoo! Restricted area, click to <a href="/logout">Logout</a>')
})

app.get('/logout', function(req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function() {
    res.redirect('/')
  })
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', function(req, res, next) {
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user
        req.session.success = 'Authenticated as ' + user.name + ' click to <a href="/logout">Logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.'
        res.redirect('back')
      })
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")'
      res.redirect('/login')
    }
  })
})

const PORT = process.env.PORT || 8080

if (!module.parent) {
  app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
}