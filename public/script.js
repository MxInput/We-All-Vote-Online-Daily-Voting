
function start() {
    let signUpForm = document.getElementById('signUpForm')

    signUpForm.addEventListener('submit', function (event) {
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