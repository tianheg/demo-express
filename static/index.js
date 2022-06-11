const express = require("express")
const app = express()

app.use('/static', express.static("public"))
// http://localhost:8080/static/
app.use('/', express.static("public2"))
// http://localhost:8080/2.html

// 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broken!')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
