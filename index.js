const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

function loginOrNot(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'google-authentication', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google"> <input type="submit" value="Click Hear To Authorize With Google" /></a>');
    // res.send('<a href="/auth/google">Click Hear To Authorize With Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
    ));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/protected', loginOrNot, (req, res) => {
    res.send(`you are authenticated ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('See You Again!!');
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Authentication failed');
});

app.listen(process.env.PORT, () => console.log(`listening on port: process.env.PORT`));
    ``
