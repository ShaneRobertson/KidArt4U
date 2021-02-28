
// imported passport js call
const passport = require('passport')

// imported google strategy library
const GoogleStrategy = require('passport-google-oauth20')

const keys = require('./keys')

// tell passport that we want to use google strategy for our project
passport.use(
    new GoogleStrategy({

        // options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret


    }, () => {

        // passport callback function will fire at some point during authentication process
    })

)