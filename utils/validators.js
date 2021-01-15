const {body} = require('express-validator')

exports.registerValidators = [
    body('email').isEmail().withMessage('Please enter correct email'),
    body('password', 'Password must have at least 6 characters').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }),
    body('name').isLength({min: 3}).withMessage('Name must be 3 or more characters')
]