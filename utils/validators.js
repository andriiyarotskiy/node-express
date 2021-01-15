const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Please enter correct email').custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject('This mail is already taken')
            }
        } catch (e) {
            console.log(e)
        }
    }),
    body('password', 'Password must have at least 6 characters').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }),
    body('name').isLength({min: 3}).withMessage('Name must be 3 or more characters')
]