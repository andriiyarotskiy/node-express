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

    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = password === candidate.password
            if (areSame){
                req.session.user = candidate
                req.session.isAuthenticated = true
                // метод save отлавливает ошибку если пользователь не успел залогинится
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            }else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e)
    }

})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const user = new User({
                email, name, password, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {

    }
})


module.exports = router