const fs = require('fs');

var users

fs.readFile("login.json", function (err, data) {
    if (err) throw err

    users = JSON.parse(data)
})

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/signUp', (req, res) => {
    const formData = req.body;
    console.log(JSON.parse(formData))
    res.send("OK")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));