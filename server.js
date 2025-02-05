const express = require('express')
const app = express()

const UserTableByEmail = new Map();
const UserTableByID = new Map();

const bodyParser = require('body-parser')

function formatDateTime(dateInput) {
  // Use the passed date, or default to the current date if no date is provided
  const currentDate = new Date(dateInput || Date.now());

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 as months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDate(dateInput) {
  // Use the passed date, or default to the current date if no date is provided
  const currentDate = new Date(dateInput || Date.now());

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 as months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getUserTable() {
  return Object.fromEntries(UserTableByEmail)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Start server at port 3000.')
  })

app.get('/', (req, res) => {
  console.log("----------- host -----------")

    res.json(getUserTable())
})

app.get('/user', (req, res) => {
  console.log("----------- All user -----------")

    res.json(getUserTable())
})

app.post('/user-table', (req, res) => {
  console.log("----------- Update table -----------")

  const newTable = new Map(Object.entries(req.body));

  if (newTable instanceof Map) {
    UserTableByEmail.clear();
    UserTableByID.clear();

    for (const [key, value] of newTable) {
      UserTableByEmail.set(key, value);
      UserTableByID.set(value.id, value)
    }
    res.json(getUserTable())     
  } else {
    res.status(400).send('table structure is missing')
  }
})  

app.post('/user/register', (req, res) => {
  console.log("----------- Register -----------")

  if (!UserTableByEmail.has(req.body.email)) {
    newUser = {
      "id": UserTableByEmail.size.toString(),
      "name": req.body.name,
      "email": req.body.email,
      "password": req.body.password,
      "dob": req.body.dob,
      "skin": req.body.skin,
      "class": req.body.class
    }

    console.log(newUser)

    UserTableByEmail.set(newUser.email, newUser)
    UserTableByID.set(newUser.id, newUser)

    response = {
      "id": newUser.id,
      "name": newUser.name,
      "email": newUser.email,
      "dob": newUser.dob,
      "skin": newUser.skin,
      "class": newUser.class
    }
    res.status(200).json(response)
  } else {
    res.status(400).send('User is existing')
  }
})

app.get('/user/profile/:id', (req, res) => {
  console.log("----------- Profile " + req.params.id + " -----------")

  if (!UserTableByID.has(req.params.id)) {
    res.status(404).send('User not found')
  } else {
    const user = UserTableByID.get(req.params.id)
    console.log(user)

    response = {
      "id": user.id,
      "name": user.name,
      "email": user.email,
      "dob": user.dob,
      "skin": user.skin,
      "class": user.class
    }
    res.status(200).json(response)
  }  
})

app.put('/user', (req, res) => {
  console.log("----------- Skin -----------")
  console.log(req.body)

  if (!UserTableByID.has(req.body.id)) {
    res.status(404).send('User not found')
  } else {
    const user = UserTableByID.get(req.body.id)
    user.skin = req.body.skin
    console.log(user)

    UserTableByID.set(user.id, user)
    UserTableByEmail.set(user.email, user)

    response = {
      "id": user.id,
      "name": user.name,
      "email": user.email,
      "dob": user.dob,
      "skin": user.skin,
      "class": user.class
    }
    res.status(200).json(response)
  }  
})

app.post('/user/login', (req, res) => { 
  console.log("----------- Login -----------")

  if (!UserTableByEmail.has(req.body.email)) {
    res.status(404).send('User not found')
  } else {
    const user = UserTableByEmail.get(req.body.email)

    if (user.password === req.body.password) {

      response = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "dob": user.dob,
        "skin": user.skin,
        "class": user.class
      }
      res.status(200).json(response)
    } else {
      res.status(400).send('password is incorrect')
    }
  }
})

app.post('/user/forget', (req, res) => {
  console.log("----------- Forgetpassword -----------")
  res.send('ForgetPassword')
})


app.post('/user/step', (req, res) => {
  console.log("----------- Add Step -----------")


  if (!UserTableByID.has(req.body.id)) {
    res.status(404).send('User not found')
  } else {
    const user = UserTableByID.get(req.params.id)
    // TODO: save data to DB
    // structure
    // {
    //   "id":"id",
    //   "date": "2025-02-05",
    //   "steps": 20
    // }
    res.status(200).send('step')
  }  
})

app.get('/ranking/:date', (req, res) => {
  console.log("----------- Get Ranking [" + req.params.date + "] -----------")

  // TODO: calculate ranking of each day
  res.status(200).send('Get Ranking [' + req.params.date + ']')
})

app.post('/ranking', (req, res) => {
  console.log("----------- Calculate Ranking [" + formatDate() + "] -----------")

  // TODO: calculate ranking of each day
  res.status(200).send('Calculate Ranking [' + formatDate() + ']')
})