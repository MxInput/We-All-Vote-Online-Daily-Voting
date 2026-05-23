const express = require('express')
const router = express.Router()

// logout
router.get('/', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router
