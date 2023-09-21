const fs = require("fs")
const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(morgan("dev"))

// middlware
app.use(express.json())

// OUR OWN MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const PORT = process.env.port || 3000

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data//tours-simple.json`
  )
)

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "succes",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  })
}

const getTourById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  if (!tour) {
    return res.status(400).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  tours.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data//tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      })
    }
  )
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(400).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data//tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this id ${id} edited`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}

const removeTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(400).json({
      status: "failed",
      message: "data not found",
    })
  }

  tours.splice(tourIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "delete data success",
        data: null,
      })
    }
  )
}

// USER
const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data//users.json`
  )
)

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "succes",
    requestTime: req.requestTime,
    data: {
      users,
    },
  })
}

const getUserById = (req, res) => {
  const id = req.params.id
  const user = users.find((el) => el._id === id)

  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
}

const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  users.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newData,
        },
      })
    }
  )
}

const editUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  if (userIndex === -1) {
    return res.status(400).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this id ${id} edited`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}

const removeUser = (req, res) => {
  const id = req.params._id
  const userIndex = users.findIndex(
    (el) => el.id === id
  )

  if (userIndex === -1) {
    return res.status(400).json({
      status: "failed",
      message: "data not found",
    })
  }

  users.splice(userIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "delete data success",
        data: null,
      })
    }
  )
}

// ROUTING
// app.get("/api/v1/tours", getAllTours)
// app.get("/api/v1/tours/:id", getTourById)
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", editTour)
// app.delete("/api/v1/tours/:id", removeTour)

const tourRouter = express.Router()
const userRouter = express.Router()
// ROUTES UNTUK TOURSW
tourRouter
  .route("/")
  .get(getAllTours)
  .post(createTour)
tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(editTour)
  .delete(removeTour)

// ROUTES UNTUK USERS
userRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(editUser)
  .delete(removeUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`)
})
