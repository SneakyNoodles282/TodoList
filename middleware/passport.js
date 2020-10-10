const passport = require('passport')
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const { getUsers } = require("../lib/db")

function setupAuth() {
    const router = express.Router();
    const User = getUsers()
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
    //turns user object into string id
    passport.serializeUser((user, done) => {
        done(undefined, user._id);
    });
    //turns string into object id
    passport.deserializeUser((_id, done) => {
        User.findOne({ _id })
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    });

    router.post('/login',
        passport.authenticate('local', {successRedirect: '/Buildthis',
                                        failureRedirect: '/Buildthis2'})
    );

    router.post('/signup', async (req, res) => {
        const username = req.body.username
        const password = req.body.password

        const newUser = {
            username,
            password
        }
        if(typeof username !== "string"){
            res.status(400).json({error:"Username invalid"})
            return
        }
        if(typeof password !== "string"){
            res.status(400).json({error:"Pasword invalid"})
            return
        }

        await User.insertOne(newUser)
        
        res.status(200).json({message: "Big Boi Successful"})
    })


    return router
}

module.exports = {
    setupAuth
}