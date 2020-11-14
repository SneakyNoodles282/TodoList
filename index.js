require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport')
const listItemRouter = require("./routes/list-items")
const listsRouter = require("./routes/lists")
const session = require('express-session');
var hbs = require('express-hbs');
const MongoStore = require('connect-mongo')(session);
const { connectdb, client } = require("./lib/db")
const { setupAuth } = require("./middleware/passport")
const { isLogged } = require("./middleware/auth")

// https://stackoverflow.com/questions/16781294/passport-js-passport-initialize-middleware-not-in-use
async function connectClient() {
    await connectdb()
    console.log("connected to Mongo")
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/client');
    app.engine('hbs', hbs.express4({
        partialsDir: __dirname + '/client/partials'
    }));
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
    app.use('/api', isLogged, listItemRouter)
    app.use('/api', isLogged, listsRouter)
    app.get('/', (req, res) => {
        if (!req.user){
            res.redirect('/login')
            return
        }
        res.render('todolist/page', { isLoggedIn: !!req.user })
    });
    app.get('/login', (req, res) => {
        if(req.user){
            res.redirect('/')
            return
        }
        res.render('login/page', { isLoggedIn: !!req.user })
    });
    app.get('/signup', (req, res) => {
        if(req.user){
            res.redirect('/')
            return
        }
        res.render('signup/page', { isLoggedIn: !!req.user })
    });
    app.get('/list/:name', (req,res) => {
        if (!req.user){
            res.redirect('/login')
            return
        }
        res.render('todolist/page', { isLoggedIn: !!req.user, listName : req.params.name })

    })
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