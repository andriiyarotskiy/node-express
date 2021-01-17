const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()
const path = require('path');

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        let targetFile = req.files.avatar;
        let uploadDir = path.join(__dirname, '../img', targetFile.name);
        const toChange = {
            name: req.body.name
        }
        if (targetFile) {
            toChange.avatarUrl = path.normalize(`img/${targetFile.name}`) // url img for DB
            await targetFile.mv(uploadDir); // save file to dir
        }
        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router


/*    try {
        const user = await User.findById(req.user._id)
        console.log(req.files.avatar)
        const toChange = {
            name: req.body.name
        }

        if (req.files.image) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }*/
