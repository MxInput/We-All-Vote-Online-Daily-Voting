const fs = require('fs')
const fsP = require('fs').promises;
const { constrainedMemory } = require('process')
const { convertProcessSignalToExitCode } = require('util')

function fillQuestions(callback) {
    fs.readFile("data/questions.json", function (err, data) {
        if (err) throw new Error(err)
        callback(undefined, JSON.parse(data))
    })
}

function getUser(user) {
    for (var foundUN in users) {
        if (user == foundUN) {
            return users[foundUN]
        }
    }

    return false
}

function getResponses(user) {
    try {
        if (getUser(user) != false) {
            let userData = getUser(user)
            return userData["responses"]
        }
        else {
            throw new Error("TRY AGAIN")
        }
    }
    catch {
        throw new Error(err)
    }
}

function getPredictions(user) {
    try {
        if (getUser(user) != false) {
            let userData = getUser(user)
            return userData["predictions"]
        }
        else {
            throw new Error("TRY AGAIN")
        }
    }
    catch {
        throw new Error(err)
    }
}

function getActualAnswer(questions, question, choice) {
    for (let i = 0; i < Object.keys(questions).length; i++) {
        if (questions[i]["question"] == question) {
            return [questions[i][choice["choice"]], questions[i]["choice1Count"], questions[i]["choice2Count"]]
        }
    }
    throw new Error("TRY AGAIN")
}

function getActualAnswers(user, look, callback) {
    try {
        const a = fillQuestions(function (err, data) {
            let questions = data
            let realChoices = []
            let realStatus = []

            if (look == "pred") {
                preds = getPredictions(user)
                givenQuestions = Object.keys(preds)
                choices = Object.values(preds)
                for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                    let answers = getActualAnswer(questions, givenQuestions[i], choices[i])
                    if (answers != "" && answers != undefined) {
                        let answer = answers[0]
                        let c1 = answers[1]
                        let c2 = answers[2]

                        let status = "Wrong guess"

                        if (c1 > c2 && choices[i] == "choice1") {
                            status = "Correct prediction"
                        }
                        else if (c1 < c2 && choices[i] == "choice2") {
                            status = "Correct prediction"
                        }
                        else if (c1 == c2) {
                            status = "A tie"
                        }

                        realChoices.push(answer)
                        realStatus.push(status)
                    }
                    else {
                        throw new Error("TRY AGAIN")
                    }
                }
            }
            else {
                reses = getResponses(user)
                givenQuestions = Object.keys(reses)
                choices = Object.values(reses)
                for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                    let answers = getActualAnswer(questions, givenQuestions[i], choices[i])
                    if (answers != "" && answers != undefined) {
                        let answer = answers[0]
                        realChoices.push(answer)
                    }
                    else {
                        throw new Error("TRY AGAIN")
                    }
                }
            }

            callback(null, [realChoices, realStatus])
        })
    }
    catch (err) {
        throw new Error(err)
    }
}

function fillAnswers(user, callback) {
    try {
        getActualAnswers(user, "res", function (err, result) {
            let resChoices = result[0]
            getActualAnswers(user, "pred", function (err2, result2) {
                let predChoices = result2[0]
                let predStatus = result2[1]
                callback(undefined, [resChoices, predChoices, predStatus])
            })
        })
    } catch (err) {
        console.trace(err)
        throw new Error(err)
    }
}

module.exports = {
    getUser,
    getResponses,
    getPredictions,
    fillAnswers
}