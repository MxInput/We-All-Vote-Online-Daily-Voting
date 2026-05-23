const express = require('express')
const router = express.Router()

const session = require('express-session')

// logout
router.get('/', (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login')
        })
    }
    else {
        res.redirect('/login')
    }
})

module.exports = router
