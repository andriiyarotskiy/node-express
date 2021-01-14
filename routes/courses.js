const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')

const isOwner = (course, req) => {
    return course.userId.toString() !== req.user._id.toString()
}

router.get('/', async (req, res) => {

    try {
        // find метод забирает все курсы из БД, можна передавать внутрь обьект и указывать какие параметры нужно достать
        const courses = await Course.find()
            .populate('userId', 'email name')
            // userId станет обьектом у которого есть поля cart/_id/email/name
            // второй параметр указывает какие поля попадут в обьект userId (+ _id)
            .select('price title img') // достает определенные поля из обьекта courses

        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body
        delete req.body.id
        const course = await Course.findById(id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        // Object.assign(course, req.body)
        const editCourse = {course, ...req.body}
        await editCourse.save()
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})

module.exports = router