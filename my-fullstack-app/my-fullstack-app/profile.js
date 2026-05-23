const express = require('express')
const router = express.Router()

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')
const { getActualAnswers } = require('./populateStats')

// profile
router.get('/:username', (req, res) => {
    if (req.session.authorized && req.session.user == req.params.username) {
        let gotQuestion = getQuestion()
        if (gotQuestion != undefined) {
            return res.render('profile', {
                username: req.params.username
            })
        }
        else {
            return res.render('votingErr', {
                err: "No more questions"
            })
        }
    }
    else {
        res.redirect('/login')
    }
})

router.post('/', (req, res) => {
    try {
        if (req.session.authorized && req.session.user) {
            let gotQuestion = getQuestion()

            if (gotQuestion != undefined) {
                if (req.body.hasOwnProperty("choice1")) {
                    let question = getQuestion()

                    found = true
                    foundResponses = users[req.session.user]["responses"]
                    if (foundResponses) {
                        if (foundResponses[question["question"]] != undefined) {
                            throw new Error("Already Voted")
                        }
                    }

                    res.render('voting', {
                        username: req.session.user,
                        choice1: gotQuestion["choice1"],
                        choice2: gotQuestion["choice2"],
                        question: gotQuestion["question"]
                    })
                } else if (req.body.hasOwnProperty("choice2")) {
                    let question = getQuestion()

                    found = true
                    foundResponses = users[req.session.user]["predictions"]
                    if (foundResponses) {
                        if (foundResponses[question["question"]] != undefined) {
                            throw new Error("Already Voted")
                        }
                    }

                    res.render('predicting', {
                        username: req.session.user,
                        choice1: gotQuestion["choice1"],
                        choice2: gotQuestion["choice2"],
                        question: gotQuestion["question"]
                    })
                }
                else if (req.body.hasOwnProperty("choice3")) {
                    let resChoices = getActualAnswers(req.session.user, "res")
                    let predChoices = getActualAnswers(req.session.user, "pred")

                    console.log(resChoices)
                    res.render('stats', {
                        username: req.session.user,
                        responses: getResponses(req.session.user),
                        predictions: getPredictions(req.session.user)
                    })
                }
                else {
                    res.redirect(`/profile/${req.session.user}`)
                }
            }
            else {
                return res.render('votingErr', {
                    err: "No more questions"
                })
            }
        }
        else {
            res.redirect(`/profile/${req.session.user}`)
        }
    }
    catch (err) {
        if (err.message == "Already Voted") {
            res.render('votingError', {
                err: err
            })
        }
    }
})

module.exports = router
