const express = require('express')
const app = express()

const UserTable = require('./user')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Start server at port 3000.')
  })

  app.get('/user', (req, res) => {
    res.json(UserTable)
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
  console.log("Profile")
  res.json(UserTable.find(user => user.id === req.params.id))
})

app.put('/user', (req, res) => {
  console.log("Skin")
  const updateIndex = user.findIndex(user => user.id === req.body.id)
  res.json(Object.assign(UserTable[updateIndex].skin, req.body.skin))
})

app.post('/user/login', (req, res) => {
  console.log("Login")
  res.send('Log in')
})

app.post('/user/forget', (req, res) => {
  console.log("Forgetpassword")
  res.send('ForgetPassword')
})