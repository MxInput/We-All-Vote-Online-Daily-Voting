const express = require('express')
const router = express.Router()

const fs = require('fs')

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')

// voting
router.post('/', (req, res) => {
    try {
        let found = false

        if (req.session.user) {
            for (var foundUN in users) {
                if (req.session.user == foundUN) {
                    let question = getQuestion()

                    found = true
                    foundResponses = users[req.session.user]["responses"]
                    if (foundResponses) {
                        if (foundResponses[question["question"]] != undefined) {
                            throw new Error("Already Voted")
                        }
                        else {
                            let newEntry

                            if (req.body.hasOwnProperty("choice1")) {
                                newEntry = "choice1"
                                addVote("choice1")
                            } else {
                                newEntry = "choice2"
                                addVote("choice2")
                            }

                            foundResponses[question["question"]] = newEntry

                            let updatedUsers = users
                            updatedUsers[`${req.session.user}`] = { password: users[req.session.user]["password"], responses: foundResponses, predictions: users[req.session.user]["predictions"] }

                            fs.writeFile("login.json", JSON.stringify(updatedUsers), (err) => {
                                if (err) { throw err }
                            })
                        }
                    }
                    res.render('votingCompleted', { username: req.session.user })
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
            res.render('votingError', {
                err: err
            })
        }
        else {
            res.redirect('/login')
        }
    }
})

module.exports = router
