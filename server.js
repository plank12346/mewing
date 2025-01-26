const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Start server at port 3000.')
  })

app.post('/user/login', (req, res) => {
  res.send('Log in')
})

app.post('/user/forget', (req, res) => {
  res.send('ForgetPassword')
})

app.put('/user/skin', (req, res) => {
  res.send('Skin')
})

app.post('/user/register', (req, res) => {
  res.send('Register')
})

app.get('/user/:id', (req, res) => {
  res.send('Profile')
})

const UserTable = require('./user')

app.get('/Login', (req, res) => {
  res.json(Login)
})
