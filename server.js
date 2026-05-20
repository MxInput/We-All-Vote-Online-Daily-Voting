const express = require('express')
const app = express()
app.get('/secretmessage', (req, res) => {
    res.send('The martians are hiding underground!');
})
app.listen(3000)