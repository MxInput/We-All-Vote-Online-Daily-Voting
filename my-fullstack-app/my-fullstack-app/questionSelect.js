const { json } = require('body-parser')
const fs = require('fs')
const { get } = require('http')
const { findPackageJSON } = require('module')

var questions

function fillQuestions(callback) {
    fs.readFile("questions.json", function (err, data) {
        if (err) return callback(err, null)
        callback(null, JSON.parse(data))
    })
}

function activateQuestion() {
    fillQuestions(function assignQuestions(err, result) {
        questions = result

        selectQuestion()
    })
}

function getQuestion() {
    let foundQuestion

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy;

    for (let i = 0; i < Object.keys(questions).length; i++) {
        if (questions[i]["date"] == today) {
            return questions[i]
        }
    }

    return undefined
}

function selectQuestion() {
    if (getQuestion() != undefined) {
        return getQuestion()
    }
    else {
        let random = Math.floor(Math.random() * Object.keys(questions).length)
        let selected = undefined
        let able = false
        for (let i = 0; i < Object.keys(questions).length; i++) {
            if (questions[i]["date"] == "") {
                able = true
                break
            }
        }
        if (able == true) {
            while (selected == undefined) {
                if (questions[random]["date"] == "") {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0')
                    var mm = String(today.getMonth() + 1).padStart(2, '0')
                    var yyyy = today.getFullYear()

                    today = mm + '/' + dd + '/' + yyyy;
                    questions[random]["date"] = today
                    fs.writeFile("questions.json", JSON.stringify(questions), (err) => {
                        if (err) { console.log(err) }
                    })
                    return questions[random]
                }
                random = Math.floor(Math.random(0, Object.keys(questions).length - 1))
            }
        }
        else {
            return "none"
        }
    }
}

module.exports = {
    activateQuestion,
    getQuestion
}