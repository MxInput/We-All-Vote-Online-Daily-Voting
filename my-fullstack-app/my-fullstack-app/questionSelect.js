const fs = require('fs')
var questions

fs.readFile("questions.json", function (err, data) {
    if (err) throw err
    questions = JSON.parse(data)
    console.log(questions)
})

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
}

function selectQuestion() {

}

module.exports = {
    getQuestion,
    selectQuestion
}