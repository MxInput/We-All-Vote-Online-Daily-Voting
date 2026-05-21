function fetchHtml(data) {
    fetch('http://localhost:8080/login', {
        method: 'POST',
        body: data
    })
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            document.body.innerHTML = html
        });
}

function start() {
    let loginForm = document.getElementById('loginForm')
    let signUpForm = document.getElementById('signUpForm')

    loginForm.addEventListener('submit', function (event) {
        var username = document.getElementById('logUN').value;
        var password = document.getElementById('logPW').value;

    });

    signUpForm.addEventListener('submit', function (event) {
        var newUsername = document.getElementById('signUN').value;
        var newPassword = document.getElementById('signPW').value;
        var confirmPassword = document.getElementById('pWRepeat').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            event.preventDefault();
        }
    }
    )
}

function showSignUp() {
    let signUpButton = document.getElementById('signUpBtn')
    signUpButton.style.display = 'none'

    let loginButton = document.getElementById('loginBtn')
    loginButton.style.display = 'none'

    let signUpBlock = document.getElementById('signUpBlock')
    signUpBlock.style.display = 'block'
}

function closeSignUp() {
    let signUpButton = document.getElementById('signUpBtn')
    signUpButton.style.display = 'inline-block'

    let loginButton = document.getElementById('loginBtn')
    loginButton.style.display = 'inline-block'

    let signUpBlock = document.getElementById('signUpBlock')
    signUpBlock.style.display = 'none'
}

function showLogin() {
    let signUpButton = document.getElementById('signUpBtn')
    signUpButton.style.display = 'none'

    let loginButton = document.getElementById('loginBtn')
    loginButton.style.display = 'none'

    let loginBlock = document.getElementById('loginBlock')
    loginBlock.style.display = 'block'
}

function closeLogin() {
    let signUpButton = document.getElementById('signUpBtn')
    signUpButton.style.display = 'inline-block'

    let loginButton = document.getElementById('loginBtn')
    loginButton.style.display = 'inline-block'

    let loginBlock = document.getElementById('loginBlock')
    loginBlock.style.display = 'none'
}