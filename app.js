const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const path = require('path')

const app = express()

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.options('/contact', cors())
app.post('/contact', cors(),  (req, res) => {
  console.log('contact needs nodemailer implemented')
})

app.listen(3001)