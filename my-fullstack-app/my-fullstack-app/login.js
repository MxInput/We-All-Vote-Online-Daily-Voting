const express = require('express')
const router = express.Router()

// default page
router.get('/', (req, res) => {
    res.render('signUp')
})

// login
router.post('/', (req, res) => {
    try {
        const { logUN, logPW } = req.body

        for (var foundUN in users) {
            if (logUN == foundUN) {
                if (logPW == users[foundUN]["password"]) {
                    res.cookie('username', logUN, { secure: true })
                    req.session.user = logUN
                    req.session.authorized = true
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

module.exports = router