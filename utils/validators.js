const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Please enter correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('This mail is already taken')
                }
            } catch (e) {
                console.log(e)
            }
        }).normalizeEmail(),
    body('password', 'Password must have at least 6 characters')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match')
        }
        return true
    }).trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name must be 3 or more characters')
        .trim()
]
exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Please enter correct email')
        .normalizeEmail()
        .trim(),
    body('password', 'Password must have at least 6 characters')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim()
]

exports.courseValidators = [
    body('title').isLength({min: 3})
        .withMessage('Minimum title length 3 characters')
        .trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct URL address image').isURL()
]
