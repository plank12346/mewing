const express = require('express')
const app = express()

const UserTableByEmail = new Map();
const UserTableByID = new Map();

const StepTable = new Map();
const RankingRawTable = new Map();
const RankingTable = new Map();

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

function getUserByID(id) {
  const user = UserTableByID.get(id)
  console.log(user)

  const userInfo = {
    "id": user.id,
    "name": user.name,
    "email": user.email,
    "dob": user.dob,
    "skin": user.skin,
    "class": user.class
  }

  return userInfo
}

function getUserTable() {
  return Object.fromEntries(UserTableByEmail)
}

function mapToObject(map) {
  if (map instanceof Map) {
    return Object.fromEntries(
      Array.from(map.entries()).map(([key, value]) => [key, mapToObject(value)])
    );
  }
  return map; // Return the value directly if it's not a Map
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Start server at port 3000.')
  })

  
app.get('/ver', (req, res) => {
  console.log("----------- version -----------")

  return res.send("1.0.0")
})

app.get('/', (req, res) => {
  console.log("----------- host -----------")

  return res.json(getUserTable())
})

app.get('/user', (req, res) => {
  console.log("----------- All user -----------")

  return res.json(getUserTable())
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
    return res.status(200).json(response)
  } else {
    return res.status(400).send('User is existing')
  }
})

app.get('/user/profile/:id', (req, res) => {
  console.log("----------- Profile " + req.params.id + " -----------")

  if (!UserTableByID.has(req.params.id)) {
    return res.status(404).send('User not found')
  } else {
    return res.status(200).json(getUserByID(req.params.id))   
  }  
})

app.put('/user', (req, res) => {
  console.log("----------- Skin -----------")
  console.log(req.body)

  if (!UserTableByID.has(req.body.id)) {
    return res.status(404).send('User not found')
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
    return res.status(200).json(response)
  }  
})

app.post('/user/login', (req, res) => { 
  console.log("----------- Login -----------")

  if (!UserTableByEmail.has(req.body.email)) {
    return res.status(404).send('User not found')
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
      return res.status(200).json(response)
    } else {
      return res.status(400).send('password is incorrect')
    }
  }
})

app.post('/user/forget', (req, res) => {
  console.log("----------- Forgetpassword -----------")
  return res.send('ForgetPassword')
})


app.post('/user/step', (req, res) => {
  console.log("----------- Add Step -----------")

  if (!UserTableByID.has(req.body.id)) {
    return res.status(404).send('User not found')
  } 

  const userInfo = getUserByID(req.body.id)

  const stepInfoByDate = RankingRawTable.get(req.body.date) || new Map();
  const stepInfoByClass = stepInfoByDate.get(userInfo.class) || new Map();
  stepInfoByClass.set(req.body.id, req.body.step)
  stepInfoByDate.set(userInfo.class, stepInfoByClass);
  RankingRawTable.set(req.body.date, stepInfoByDate)
  // console.log(stepInfoByClass)
  // console.log(stepInfoByDate)
  // console.log(RankingRawTable)


  const userStepData = StepTable.get(req.body.id) || new Map(); 
  userStepData.set(req.body.date, req.body.step)
  StepTable.set(req.body.id, userStepData)
  // console.log(userStepData)
  // console.log(StepTable)

  res.status(200).json(Object.fromEntries(userStepData))
})

app.get('/ranking-raw-table', (req, res) => {
  console.log("----------- Get Ranking Table -----------")

  res.status(200).json(mapToObject(RankingRawTable))
})

app.get('/ranking-table', (req, res) => {
  console.log("----------- Get Ranking Table -----------")

  res.status(200).json(mapToObject(RankingTable))
})

app.get('/step-table', (req, res) => {
  console.log("----------- Get Step Table -----------")

  res.status(200).json(mapToObject(StepTable))
})

app.get('/ranking/:date', (req, res) => {
  console.log("----------- Get Ranking [" + req.params.date + "] -----------")

  if (!RankingTable.has(req.params.date)) {
    return res.status(404).send('No Data')
  } 

  return res.status(200).send(RankingTable.get(req.params.date))
})

app.get('/ranking-calculate/:date', (req, res) => {
  console.log("----------- Calculate Ranking [" + req.params.date + "] -----------")

  if (!RankingRawTable.has(req.params.date)) {
    return res.status(404).send('No Data')
  } 

  const result = Array.from(RankingRawTable.get(req.params.date))
    .map(([className, steps]) => {
      const totalSteps = Array.from(steps.values()).reduce((acc, val) => acc + val, 0);
      return {
        className,
        sum: totalSteps
      };
    })
    .sort((a, b) => b.sum - a.sum);
  console.log(result)

  RankingTable.set(req.params.date, result)

  return res.status(200).send(result)
})

app.post('/ranking', (req, res) => {
  console.log("----------- Calculate Ranking [" + formatDate() + "] -----------")

  // TODO: calculate ranking of each day
  res.status(200).send('Calculate Ranking [' + formatDate() + ']')
})