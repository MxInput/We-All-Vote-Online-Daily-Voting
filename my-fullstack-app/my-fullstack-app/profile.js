const express = require('express')
const router = express.Router()

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')
const { getResponses, getPredictions, fillAnswers, getUser } = require('./populateStats')

// profile
router.get('/:username', (req, res) => {
    if (req.session.authorized && req.session.user == req.params.username) {
        console.log("YES")
        let gotQuestion = getQuestion()
        if (gotQuestion != undefined) {
            return res.render('userPage/profile', {
                username: req.params.username
            })
        }
        else {
            return res.render('userPage/votingErr', {
                err: "No more questions"
            })
        }
    }
    else {
        console.log("NO")
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

                    res.render('userPage/voting', {
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

                    res.render('userPage/predicting', {
                        username: req.session.user,
                        choice1: gotQuestion["choice1"],
                        choice2: gotQuestion["choice2"],
                        question: gotQuestion["question"]
                    })
                }
                else if (req.body.hasOwnProperty("choice3")) {
                    let resChoices
                    let predChoices

                    fillAnswers(req.session.user, function operate(err, result) {
                        try {
                            shownResChoices = result[0]
                            shownPredChoices = result[1]
                            shownResults = result[2]

                            let shownResponses = Object.keys(getResponses(req.session.user))
                            let shownPredictions = Object.keys(getPredictions(req.session.user))

                            let points = getUser(req.session.user)["points"]

                            res.render('userPage/stats', {
                                points: points,
                                responses: shownResponses,
                                resChoices: shownResChoices,
                                predictions: shownPredictions,
                                predChoices: shownPredChoices,
                                results: shownResults
                            })
                        }
                        catch (err) {
                            res.render('userPage/votingError', {
                                err: err
                            })
                        }
                    })
                }
                else {
                    res.redirect(`/profile/${req.session.user}`)
                }
            }
            else {
                return res.render('userPage/votingErr', {
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
