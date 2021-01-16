const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()

router.get('/',auth, async (req,res)=> {
    res.render('profile',{
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/',auth, async(req,res)=>{

})

module.exports = router
