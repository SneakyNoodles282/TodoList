require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport')
const listItemRouter = require("./routes/list-items")
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { connectdb, client } = require("./lib/db")
const { setupAuth } = require("./middleware/passport")

// https://stackoverflow.com/questions/16781294/passport-js-passport-initialize-middleware-not-in-use
async function connectClient() {
    await connectdb()
    console.log("connected to Mongo")
    app.use(express.static('client'))
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.use(session({
        secret: 'foo',
        store: new MongoStore({client})
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/auth', setupAuth())
    app.use('/api', listItemRouter)
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/todolist.html'));
    });
    app.get('/login', (req, res) => {
        if(req.user){
            res.redirect('/')
            return
        }
        res.sendFile(path.join(__dirname + '/client/login/page.html'));
    });
    app.get('/signup', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/signup/page.html'));
    });
    app.listen(8000, () => console.log('Server Online'));
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