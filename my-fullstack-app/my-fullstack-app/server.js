const fs = require('fs')

fs.readFile("login.json", function (err, data) {
    if (err) throw err
    users = JSON.parse(data)
})

const express = require('express')
const bodyParser = require('body-parser')
const { sign } = require('crypto')
const { getQuestion, selectQuestion, activateQuestion } = require('./questionSelect')
const app = express()
app.set('view engine', 'ejs')

activateQuestion()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

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

app.get('/profile/:username', (req, res) => {
    let gotQuestion = getQuestion()
    if (gotQuestion != undefined) {
        return res.render('voting', {
            username: req.params.username,
            choice1: gotQuestion["choice1"],
            choice2: gotQuestion["choice2"],
            question: gotQuestion["question"]
        })
    }
    else {
        return res.render('votingErr', {
            err: "No more questions"
        })
    }
});

app.post('/voting', (req, res) => {
    try {
        return res.render('votingCompleted', { username: "hi" })
    } catch (err) {
        return res.render('votingError', { text: err })
    }
})


app.post('/signUp', (req, res) => {
    try {
        const { signUN, signPW, pWRepeat } = req.body

        for (var foundUN in users) {
            if (signUN == foundUN) {
                throw new Error("Username already exists!")
            }
        }

        let updatedUsers = users
        updatedUsers[`${signUN}`] = { password: `${signPW}`, responses: {} }

        fs.writeFile("login.json", JSON.stringify(updatedUsers), (err) => {
            if (err) { console.log(err) }
        })

        return res.redirect(`/profile/${signUN}`)
    } catch (err) {
        return res.render('signUp', { text: err })
    }
})

app.post('/login', (req, res) => {
    try {
        const { logUN, logPW } = req.body

        for (var foundUN in users) {
            if (logUN == foundUN) {
                if (logPW == users[foundUN]["password"]) {
                    return res.redirect(`/profile/${logUN}`)
                }
                else {
                    throw new Error("Incorrect Password!")
                }
            }
        }

        throw new Error("User not found!")
    } catch (err) {
        return res.render('signUp', { text: err })
    }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, function (err) {
    if (err) console.log(err)
    console.log(`Server started on port ${PORT}`)
})