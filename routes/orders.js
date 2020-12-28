const {Router} = require('express')
const Order = require('../models/order')
const router = Router()


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({'user.userID': req.user._id})
            .populate('user.userID')

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price // ошибка когда c.course.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseID')
            .execPopulate()

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseID._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userID: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router