const fs = require('fs')

const express = require('express')
const app = express()

const session = require('express-session')

app.use(session(
    {
        secret: 'mysecretdontsteal',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000
        }
    }));

fs.readFile("login.json", function (err, data) {
    if (err) throw err
    users = JSON.parse(data)
})

const bodyParser = require('body-parser')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')

activateQuestion()

const login = require('./login')
const signUp = require('./signUp')
const logOut = require('./logOut')
const profile = require('./profile')
const voting = require('./voting')
const predicting = require('./predicting')

app.use('/login', login)
app.use('/signUp', signUp)
app.use('/logout', logOut)
app.use('/profile', profile)
app.use('/voting', voting)
app.use('/predicting', predicting)

app.get('/', (req, res) => {
    res.sendFile('E:/Downloads/cook/views/signUp.html', function (err) {
        if (err) {
            res.sendStatus(500)
        }
        else {
            res.sendStatus(200)
        }
    }
    )
})

const PORT = process.env.PORT || 8080

app.listen(PORT, function (err) {
    if (err) console.log(err)
    console.log(`Server started on port ${PORT}`)
})
