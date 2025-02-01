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
  console.log("All user ")

    res.json(UserTable)
})
  

app.post('/user/register', (req, res) => {
  console.log("Register ")

  const user = UserTable.find(user => user.id === req.body.id)
  console.log(UserTable.length)
  console.log(user)
  if (user === undefined){
    UserTable.push(req.body)
    res.status(200).json(req.body)
  }else {
    res.status(400).send('User is existing')
  }
})

app.get('/user/profile/:id', (req, res) => {
  console.log("Profile " + req.params.id)

  const user = UserTable.find(user => user.id === req.params.id)
  console.log(UserTable.length)
  console.log(user)
  if (user === undefined){
    res.status(404).send('User not found')
  }else {
    console.log(user)

    res.status(200).json(user)
  }  
})

app.put('/user', (req, res) => {
  console.log("Skin")
  console.log(req.body)

  const updateIndex = UserTable.findIndex(user => user.id === req.body.id)
  console.log(UserTable.length)
  console.log("index :" + updateIndex)

  if (updateIndex < 0){
    res.status(404).send('User not found')
  }else {
    user = UserTable[updateIndex]
    user.skin = req.body.skin
    console.log(user)

    res.status(200).json(Object.assign(UserTable[updateIndex], user))
  }  
})

app.post('/user/login', (req, res) => { 
  console.log("Login")

  const user = UserTable.find(user => user.email === req.body.email)
  console.log(UserTable.length)
  console.log(user)

 if (user === undefined){
    res.status(404).send('User not found')
  }else if (user.password === req.body.password) {
    res.status(200).json(user.id)
  }  else {
    res.status(400).send('password is incorrect')
  }
})

app.post('/user/forget', (req, res) => {
  console.log("Forgetpassword")
  res.send('ForgetPassword')
})