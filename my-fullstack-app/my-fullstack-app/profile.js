const express = require('express')
const router = express.Router()

const { getQuestion, activateQuestion, addVote } = require('./questionSelect')

// profile
router.get('/:username', (req, res) => {
    if (req.session.authorized && req.session.user == req.params.username) {
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
    }
    else {
        res.redirect('/login')
    }
})

module.exports = router
