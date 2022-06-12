'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.use(logger(':method :url'));
app.use(cookieParser('my secret'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!');
  } else {
    res.send(
      '<form method="post"><p>Click to <label>' +
        '<input type="checkbox" name="remember"> remember me</label> ' +
        '<input type="submit" value="Submit">.</p></form>'
    );
  }
});

app.get('/forget', (req, res) => {
  res.clearCookie('remember');
  res.redirect('back');
});

app.post('/', (req, res) => {
  const minute = 6000;
  if (req.body.remember) res.cookie('remember', 1, { maxAge: minute })
  res.redirect('back')
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
