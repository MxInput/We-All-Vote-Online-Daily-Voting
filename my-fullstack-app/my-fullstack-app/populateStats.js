const fs = require('fs')
const fsP = require('fs').promises;
const { constrainedMemory } = require('process')
const { convertProcessSignalToExitCode } = require('util')

function fillQuestions(callback) {
    fs.readFile("questions.json", function (err, data) {
        if (err) return callback(err, undefined)
        callback(undefined, JSON.parse(data))
    })
}

async function fillQuestions() {
    try {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(fsP.readFile("questions.json", "utf8"))
            }, 5000)
        })
    }
    catch (err) {
        throw new Error(err)
    }
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

async function getActualAnswer(questions, question, choice) {
    try {
        for (let i = 0; i < Object.keys(questions).length; i++) {
            if (questions[i]["question"] == question) {
                return await questions[i][choice]
            }
        }
        throw new Error("BAD")
    }
    catch (err) {
        console.trace(err)
        throw new Error(err)
    }
}

async function getActualAnswers(user, look) {
    try {
        let questions = await fillQuestions()
        console.log(questions)
        let realChoices = []

        if (look == "pred") {
            console.log(questions)
            preds = await getPredictions(user)
            givenQuestions = Object.keys(preds)
            choices = Object.values(preds)
            for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                let answer = getActualAnswer(questions, givenQuestions[i], choices[i])
                if (answer != "" && answer != undefined) {
                    realChoices.push()
                }
            }
            console.log("L", realChoices)
        }
        else {
            reses = await getResponses(user)
            givenQuestions = Object.keys(reses)
            choices = Object.values(reses)
            for (let i = 0; i < Object.keys(givenQuestions).length; i++) {
                realChoices.push(getActualAnswer(questions, givenQuestions[i], choices[i]))
            }
        }
        console.log("AA", realChoices)

        return realChoices
    }
    catch (err) {
        console.trace(err)
        throw new Error(err)
    }
}

async function fillAnswers(user, callback) {
    let resChoices
    let predChoices
    try {
        console.log(resChoices)
        resChoices = await getActualAnswers(user, "res")
        predChoices = await getActualAnswers(user, "pred")
    } catch (err) {
        console.trace(err)
        throw new Error(err)
    }

    callback(undefined, [resChoices, predChoices])
}

module.exports = {
    getResponses,
    getPredictions,
    fillAnswers
}