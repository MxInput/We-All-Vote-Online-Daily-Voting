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

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/signUp', (req, res) => {
    try {
        const { signUN, signPW, pWRepeat } = req.body;

        for (var foundUN in users) {
            if (signUN == foundUN) {
                throw new Error("Username found already!")
            }
        }

        const user = `${signUN}: ${signPW}`

        fs.appendFile("login.json", user)
        res.send(`Registration successful, ${signUN}!`);
    } catch (err) {
        res.send('error');
        res.redirect('/signUp');
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));