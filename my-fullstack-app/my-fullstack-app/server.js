const fs = require('fs')

fs.readFile("login.json", function (err, data) {
    if (err) throw err
    users = JSON.parse(data)
})

const express = require('express')
const bodyParser = require('body-parser')
const { sign } = require('crypto')
const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('E:/Downloads/cook/public/signUp.html', function (err) {
        if (err) {
            res.sendStatus(500)
        }
        else {
            res.sendStatus(200)
        }
    }
    )
})

app.get('/profile', (req, res) => {
    return res.send("got profile")
    return res.sendStatus(200)
});

app.post('/signUp', (req, res) => {
    try {
        const { signUN, signPW, pWRepeat } = req.body

        for (var foundUN in users) {
            if (signUN == foundUN) {
                throw new Error("Username found already!")
            }
        }

        let updatedUsers = users
        updatedUsers[`${signUN}`] = `${signPW}`

        fs.writeFile("login.json", JSON.stringify(updatedUsers), (err) => {
            if (err) { console.log(err) }
        })

        return res.redirect('/profile')
    } catch (err) {
        res.send({ 'message': err })
    }
})

app.get('/login', (req, res) => {
    res.render('../public/signUp')
})

app.post('/login', (req, res) => {
    try {
        const { logUN, logPW } = req.body

        for (var foundUN in users) {
            if (logUN == foundUN) {
                if (logPW == users[foundUN]) {
                    return res.redirect('/profile')
                }
                else {
                    throw new Error("Incorrect Password!")
                }
            }
        }

        throw new Error("User not found!")
    } catch (err) {
        if (err == "User not found!") {
            return res.status(404)
        }
        else {
            return res.status(400)
        }
    }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, function (err) {
    if (err) console.log(err)
    console.log(`Server started on port ${PORT}`)
})