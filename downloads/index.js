'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const path = require('path')

const app = express();

const FILES_DIR = path.join(__dirname, 'files')

app.get('/', (req, res) => {
  res.send('<ul>' +
  '<li>Download <a href="/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
  '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>' +
  '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>' +
  '</ul>')
})

// /files/* 默认通过 req.params[0] 访问
// 但这里通过 :file
app.get('/files/:file(*)', (req, res, next) => {
  res.download(req.params.file, { root: FILES_DIR }, (err) => {
    if (!err) return
    if (err.status !== 404) return next(err)
    res.statusCode = 404
    res.send('Can\'t find that file, sorry!')
  })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
