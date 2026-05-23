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
    try {
        for (var foundUN in users) {
            if (user == foundUN) {
                return users[foundUN]
            }
        }
        throw new Error("BAD")
    }
    catch {
        throw new Error("BAD")
    }
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
            if (typeof choice === 'object' && !Array.isArray(choice) && choice !== null) {
                return [questions[i][choice["choice"]], questions[i]["choice1Count"], questions[i]["choice2Count"]]
            }
            else {
                return [questions[i][choice], questions[i]["choice1Count"], questions[i]["choice2Count"]]
            }
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

                if (Object.keys(givenQuestions).length > 0) {
                    for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                        let answers = getActualAnswer(questions, givenQuestions[i], choices[i])
                        if (answers != "" && answers != undefined) {
                            let answer = answers[0]
                            let c1 = answers[1]
                            let c2 = answers[2]

                            let status = "Voting in Progress"

                            if (choices[i]["active"] == false) {

                                if (c1 > c2 && choices[i]["choice"] == "choice1") {
                                    status = "Correct prediction: " + Math.floor((c1 / (c1 + c2)) * 100) + "% majority!"
                                }
                                else if (c1 < c2 && choices[i]["choice"] == "choice2") {
                                    status = "Correct prediction" + Math.floor((c2 / (c1 + c2)) * 100) + "% majority!"
                                }
                                else if (c1 == c2) {
                                    status = "The results were a tie!"
                                }
                                else {
                                    status = "Wrong guess"

                                    if (choices[i] == "choice1") {
                                        status += ", " + Math.floor((c1 / (c1 + c2))) + "% minority!"
                                    }
                                    else {
                                        status += ", " + Math.floor((c2 / (c1 + c2))) + "% minority!"
                                    }
                                }
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
                    realChoices.push("NO PREDICTIONS YET")
                }
            }
            else {
                reses = getResponses(user)
                givenQuestions = Object.keys(reses)
                choices = Object.values(reses)

                if (Object.keys(givenQuestions).length > 0) {
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
                else {
                    realChoices.push("NO VOTES YET")
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