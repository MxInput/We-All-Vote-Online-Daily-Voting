const express = require('express')
const router = express.Router()

const fs = require('fs')

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')

router.post('/', (req, res) => {
    try {
        let found = false

        if (req.session.user) {
            for (var foundUN in users) {
                if (req.session.user == foundUN) {
                    found = true
                    foundPredictions = users[req.session.user]["predictions"]
                    if (foundPredictions) {
                        let question = getQuestion()

                        if (foundPredictions[question["question"]] != undefined) {
                            throw new Error("Already Predicted")
                        }
                        else {
                            let newEntry

                            if (req.body.hasOwnProperty("choice1")) {
                                newEntry = "choice1"
                            } else {
                                newEntry = "choice2"
                            }

                            foundPredictions[question["question"]] = newEntry

                            let updatedUsers = users
                            updatedUsers[`${req.session.user}`] = { password: users[req.session.user]["password"], responses: users[req.session.user]["responses"], predictions: foundPredictions }

                            fs.writeFile("data/login.json", JSON.stringify(updatedUsers), (err) => {
                                if (err) { throw err }
                            })
                        }
                    }
                    res.render('userPage/votingCompleted', { username: req.session.user })
                }
            }
            if (!found) {
                throw new Error("User doesn't exist")
            }
        }
        else {
            throw new Error("Invalid Session")
        }
    }
    catch (err) {
        console.log(err)
        if (err.message == "Already Voted") {
            res.render('userPage/votingError', {
                err: "Already Voted"
            })
        }
        else {
            res.redirect('/login')
        }
    }
})

module.exports = router
