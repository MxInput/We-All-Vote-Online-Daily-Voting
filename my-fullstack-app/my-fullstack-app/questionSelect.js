const { json } = require('body-parser')
const fs = require('fs')
const { get } = require('http')
const { findPackageJSON } = require('module')

var questions

function fillQuestions(callback) {
    fs.readFile("data/questions.json", function (err, data) {
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

function addVote(vote) {
    let currentQuestion = getQuestion()

    if (currentQuestion != undefined) {
        if (vote == "choice1") {
            currentQuestion["choice1Count"] += 1
        }
        else if (vote == "choice2") {
            currentQuestion["choice2Count"] += 1
        }
    }

    questions[currentQuestion["question"]] = currentQuestion

    fs.writeFile('data/questions.json', JSON.stringify(questions), (err) => {
        if (err) {
            return
        }
    })
}

function getQuestion() {
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
        let questionsPassed = 0
        for (let i = 0; i < Object.keys(questions).length; i++) {
            if (questions[i]["date"] == "") {
                able = true
                break
            }
        }
        if (able == true) {
            while (selected == undefined || questionsPassed < Object.keys(questions).length) {
                if (questions[random]["date"] == "") {
                    questionsPassed += 1

                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0')
                    var mm = String(today.getMonth() + 1).padStart(2, '0')
                    var yyyy = today.getFullYear()

                    today = mm + '/' + dd + '/' + yyyy;
                    selected = questions[random]
                    questions[random]["date"] = today
                    fs.writeFile("data/questions.json", JSON.stringify(questions), (err) => {
                        if (err) { console.log(err) }
                    })
                    return questions[random]
                }
                random = Math.floor(Math.random() * Object.keys(questions).length)
            }
        }
        else {
            return "none"
        }
    }
}

module.exports = {
    activateQuestion,
    getQuestion,
    addVote
}