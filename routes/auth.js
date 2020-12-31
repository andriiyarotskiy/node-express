const {Router} = require('express')
const router = Router()
const User = require('../models/user')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    // метод destroy вызывает колбэк ф-цию когда уничтожены все данные сессии
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5fe9a7a87b5a9e3b30f7ff08')
    req.session.user = user
    req.session.isAuthenticated = true
    // метод save отлавливает ошибку если пользователь не успел залогинится
    req.session.save(err => {
        if(err){
            throw err
        }
        res.redirect('/')
    })


})


module.exports = router