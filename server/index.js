require('dotenv').config()

const massive = require('massive');
const express = require('express');
const app = express();
const session = require('express-session');

const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;
const auth = require('./controllers/authController');
const middleware = require('./middleware/middleware')

app.use(express.json())
app.use(session({
    resave: false, //resave is asking if you want to resave this if you havent made any changes - you dont want to save what has already been saved
    saveUninitialized: true, //if we created a session, but there is nothing inside of it, do we want to create a session for them - yes
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 //equal to one week, 1000milliseconds in a second, 60 seconds, in a minute, 60 minutes in an hour, 24 hours in a day, 7 days a week
    } //once it reaches the limit we want to remove it from our computer
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized:false
    }
}).then(db => {
    app.set('db', db)
    console.log("Connected to DB")
})

//ENDPOINTS
app.post('/auth/register', middleware.checkEmail, auth.register) //post bc we are adding something new to our database
app.post('auth/login', middleware.checkEmail, auth.login) //post bc it is creating a new session (not adding to the database)
app.post('auth/logout', auth.logout) //post 90% it is a post - it is what it is
app.get('api/user', auth.getUser)

app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))