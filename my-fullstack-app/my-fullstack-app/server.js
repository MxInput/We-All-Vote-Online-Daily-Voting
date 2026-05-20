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

        let updatedUsers = users
        updatedUsers[`${signUN}`] = `${signPW}`

        fs.writeFile("login.json", JSON.stringify(updatedUsers), (err) => {
            if (err) { console.log(err) }
        })

        return res.send(`Registration successful, ${signUN}!`);
    } catch (err) {
        return res.send("err");
        return res.redirect('/');
    }
});

app.post('/login', (req, res) => {
    try {
        const { logUN, logPW } = req.body;

        for (var foundUN in users) {
            if (logUN == foundUN) {
                if (logPW == users[foundUN]) {
                    return res.send(`Login successful, ${logUN}!`);

                }
                else {
                    throw new Error("Incorrect Password!")
                }
            }
        }

        throw new Error("User not found!")
    } catch (err) {
        console.log(err)
        return res.send("err");
        return res.redirect('/');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));