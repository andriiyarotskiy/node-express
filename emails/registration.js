const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account created',
        html: `
        <h1>Welcome to shop</h1>
        <p>Account successfully created with email : ${email}</p>
        <hr />
           <a href="${keys.BASE_URL}">Course Store</a>
        `
    }
}
