// Importing the express library as a namespace "express"
require('dotenv').config()
const express = require("express")
const initDB = require('./db')
const { Pool } = require("pg")

// Creating an instance of express namespace
const app = express()

// Adding middleware
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

// Setting up postgres
const pgClientPool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

initDB.initDBData(pgClientPool)

// Rest api methods -> GET, POST, PUT, DELETE, PATCH

// Using the get method for the api (endpoint) "/teams" to get all the teams
app.get('/teams', (req, res) => {

  pgClientPool.connect((err, client, done) => {
    if(err) {
      throw err
    }
    client.query('SELECT team FROM football', (err, result) => {
      done()
      if(err) {
        throw err
      }
      res.status(200).send(result.rows)
    })
  })
})

// Using the get method for the api (endpoint) "/captains" to get all the captains
app.get('/captains', (req, res) => {

  pgClientPool.connect((err, client, done) => {
    if(err) {
      throw err
    }
    client.query(`SELECT captain FROM football`, (err, result) => {
      done()
      if(err) {
        throw err
      }
      res.status(200).send(result.rows)
    })
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`)
})
