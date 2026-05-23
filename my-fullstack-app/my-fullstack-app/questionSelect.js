const { json } = require('body-parser')
const fs = require('fs')
const { get } = require('http')
const { findPackageJSON } = require('module')
const { Error } = require('mongoose')
const { getUser } = require('./populateStats')
const { count } = require('console')

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

function getPreviousCount(question) {
    for (let i = 0; i < Object.keys(questions).length; i++) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()

        today = mm + '/' + dd + '/' + yyyy;
        if (questions[i]["date"] != today) {
            if (questions[i]["question"] == question) {
                return [questions[i]["choice1Count"], questions[i]["choice2Count"]]
            }
        }
    }
    return "incorrect"
}

function fillPrevious(user) {
    let foundUser = getUser(user)

    for (let i = 0; i < Object.keys(foundUser["predictions"]).length; i++) {
        if (Object.values(Object.values(foundUser["predictions"])[i])[1] == true) {
            let counts = getPreviousCount(Object.keys(foundUser["predictions"])[i])
            if (counts != "incorrect") {
                foundUser["predictions"][Object.keys(foundUser["predictions"])[i]]["active"] = false
                let count1 = counts[0]
                let count2 = counts[1]
                if (count1 == count2) {
                    foundUser["points"] += 50
                }
                else if (count1 > count2) {
                    if (foundUser["predictions"][Object.keys(foundUser["predictions"])[i]]["choice"] == "choice1") {
                        foundUser["points"] += 100
                    }
                }
                else {
                    if (foundUser["predictions"][Object.keys(foundUser["predictions"])[i]]["choice"] == "choice2") {
                        foundUser["points"] += 100
                    }
                }
            }
        }
    }
    let updatedUsers = users
    updatedUsers[user] = foundUser

    fs.writeFile("data/login.json", JSON.stringify(updatedUsers), (err) => {
        if (err) { throw err }
    })
    return
}

module.exports = {
    fillPrevious,
    activateQuestion,
    getQuestion,
    addVote,
    getPreviousCount
}