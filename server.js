const express = require('express')
const app = express()

const UserTable = require('./user')
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
  const userindex = UserTable.find(user => user.id === req.body.id)
  console.log(UserTable.length)
  console.log(userindex)
  if (typeof(userindex) == "undefined"){
    UserTable.push(req.body)
    res.status(201).json(req.body)
  }else {
    res.send('User is existing')
  }
})

app.get('/user/:id', (req, res) => {
  res.json(UserTable.find(user => user.id === req.params.id))
})

app.get('/user', (req, res) => {
  res.json(UserTable)
})

