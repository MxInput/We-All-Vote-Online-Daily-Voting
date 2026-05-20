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
        else {
            let values = new Object()
            values.username = newUsername
            values.password = newPassword
            let convertedValues = JSON.stringify(values);

            let data = getUserData()
            data.push(convertedValues)
            fs.writeFileSync('login.json', JSON.stringify(data));
        }
    });
}

function getUserData() {
    return fetch('login.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error fetching JSON:', error));
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