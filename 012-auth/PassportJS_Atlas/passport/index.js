const passport = require('passport'); //init passport JS and 
const LocalStrategy = require('passport-local').Strategy; //select local strategy

const {verify, findById} = require('../db/users.js'); // Get modules for users operation

// PassportJS initialization data
options = {
    username: 'username',
    password: 'password',
    passReqToCallback: false,
}

//Add a strategy with options and verify function
passport.use('local', new LocalStrategy(options, verify));

//Add saving user in sessinon
passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})
passport.deserializeUser(function (id, cb) {
    findById(id, function (err, user) {
      if (err) { return cb(err) }
      cb(null, user)
    })
})

module.exports = {passport};