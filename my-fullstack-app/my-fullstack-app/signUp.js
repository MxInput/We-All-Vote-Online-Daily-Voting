const express = require('express')
const router = express.Router()

const fs = require('fs')

// sign up
router.post('/', (req, res) => {
    try {
        const { signUN, signPW, pWRepeat } = req.body

        for (var foundUN in users) {
            if (signUN == foundUN) {
                throw new Error("Username already exists!")
            }
        }

        let updatedUsers = users
        updatedUsers[`${signUN}`] = { password: `${signPW}`, responses: {}, predictions: {} }

        res.cookie('username', signUN, { secure: true })
        req.session.user = signUN
        req.session.authorized = true

        fs.writeFile("data/login.json", JSON.stringify(updatedUsers), (err) => {
            if (err) { throw err }
        })

        return res.redirect(`/profile/${signUN}`)
    } catch (err) {
        return res.render('login/signUp', { text: err })
    }
})

module.exports = router
