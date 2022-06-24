'use strict';

/**
 * Module dependencies.
 */

const express = require('express');

const app = express();

const router = app.router;

app.get('/', (req, res) => {
  res.send('Hello, World');
  console.log(`host: ${req.host}`);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
