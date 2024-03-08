const express = require('express')
const nodemailer = require('nodemailer')
const path = require('path')

const app = express()

app.use('/public', express.static(path.join(__dirname, 'public')))


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)