const {Router} = require('express')
const router = Router()
const crypto = require('crypto') // Встроенная библиотека Node.js для генерации ключей
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const reqEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
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
            // compare асинхронный метод сравнивает пароли
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                // метод save отлавливает ошибку если пользователь не успел залогинится
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
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
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            // метод hash возвращает промис, асинхронный метод
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
            await transporter.sendMail(reqEmail(email))
        }
    } catch (e) {

    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something is wrong, please try again later')
                return res.redirect('/auth/reset')
            }
            // буфер приводи к строке с форматом hex
            const token = buffer.toJSON('hex')
            // Проверяем что в базе email должен совпадать с req.body.email
            const candidate = await User.findOne({email: req.body.email})
            if (candidate) {
                //Присваиваем токен в модель user
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 + 1000 // время жизни токена 1 час
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flesh('error', 'Email is not exist')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})
module.exports = router