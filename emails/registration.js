const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
        <h1>Добро пажаловать в магазин</h1>
        <p>Аккаунт успешно создан c email : ${email}</p>
        <hr />
           <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}