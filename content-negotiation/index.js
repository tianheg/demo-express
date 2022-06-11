'use strict'

const express = require('express')
const users = require('./db')
const app = express()

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function (req, res) {
  res.format({
    html: function () {
      res.send(
        '<ul>' +
          users
            .map(function (user) {
              return '<li>' + user.name + '</li>'
            })
            .join('') +
          '</ul>'
      )
    },

    text: function () {
      res.send(
        users
          .map(function (user) {
            return ' - ' + user.name + '\n'
          })
          .join('')
      )
    },

    json: function () {
      res.json(users)
    },
  })
})

// or someting tiny(middleware) like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(path) {
  let obj = require(path)
  return function (req, res) {
    res.format(obj)
  }
}

app.get('/users', format('./users'))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
