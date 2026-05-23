const fs = require('fs')
const { constrainedMemory } = require('process')
const { convertProcessSignalToExitCode } = require('util')

function fillQuestions(callback) {
    fs.readFile("questions.json", function (err, data) {
        if (err) return callback(err, undefined)
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
    if (getUser(user) != false) {
        let userData = getUser(user)
        return userData["responses"]
    }
    else {
        return undefined, undefined
    }
}

function getPredictions(user) {
    if (getUser(user) != false) {
        let userData = getUser(user)
        return userData["predictions"]
    }
    else {
        return undefined, undefined
    }
}

function getActualAnswer(questions, question, choice) {
    for (let i = 0; i < Object.keys(questions).length; i++) {
        if (questions[i]["question"] == question) {
            return questions[i][choice]
        }
    }

    return undefined
}

async function getActualAnswers(user, look) {
    try {
        let wanted = await fillQuestions(function getAnswer(err, result) {
            let questions = result
            let realChoices = []

            if (look == "pred") {
                preds = getPredictions(user)
                givenQuestions = Object.keys(preds)
                choices = Object.values(preds)
                for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                    realChoices.push(getActualAnswer(questions, givenQuestions[i], choices[i]))
                }
            }
            else {
                reses = getResponses(user)
                givenQuestions = Object.keys(reses)
                choices = Object.values(reses)
                for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                    realChoices.push(getActualAnswer(questions, givenQuestions[i], choices[i]))
                }
            }
            console.log(realChoices)
            return realChoices
        })
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(wanted)
        return wanted
    }
    catch (error) {
        console.error(error.message);
    }
}

async function fillAnswers(user, callback) {
    let resChoices
    let predChoices
    try {
        resChoices = await getActualAnswers(user, "res")
        predChoices = await getActualAnswers(user, "pred")
        console.log(resChoices)
    } catch (error) {
        console.error(error.message);
    }

    callback(undefined, [resChoices, predChoices])
}

module.exports = {
    getResponses,
    getPredictions,
    fillAnswers
}