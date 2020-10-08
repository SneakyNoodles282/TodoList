require('dotenv').config();
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport')
const listItemRouter = require("./routes/list-items")
const { connectdb } = require("./lib/db")
const { setupAuth } = require("./middleware/passport")

const client = new MongoClient(process.env.MONGO_DB_URI);

// https://stackoverflow.com/questions/16781294/passport-js-passport-initialize-middleware-not-in-use
async function connectClient() {
    await connectdb()
    console.log("yay")
    app.use(express.static('client'))
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.use(passport.initialize());
    app.use('/auth', setupAuth())
    app.use('/api', listItemRouter)
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/index.html'));
    });
    app.listen(8000, () => console.log('Hallo'));
}

connectClient()




/**
 * Home
 * get / 
 * TodoList
 * get /api/list-items - get list data (get list)
 * post /api/list-items/new - add todo to list
 * DELETE /api/list-items - remove all list data
 * DELETE /api/list-item/:id - delete by id (listItem in list TodoList)
 * post /api/list-item/update/:id - check uncheck(add/remove class)
 */