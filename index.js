const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // доступ к прототипам после обновлений handlebars
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5fe4a9d0cdddf4233c2ce5f8')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

// app.use - метод позволяет добавлять новые middleware, новую функциональность для приложения
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// первый параметр указывает путь второй роутер на файл
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/card', cardRouter)

const PORT = process.env.port || 3000


const start = async () => {
    try {
        const url = 'mongodb+srv://Andrii:N9RofYUiK19lRPRp@cluster0.cmkhw.mongodb.net/shop'
        await mongoose.connect(url, { //Connect - метод подключается к БД
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'wnbroz23@meta.ua',
                name: 'Andriy',
                cart: {items: []}
            })
            await user.save()
        }

        app.listen(3000, () => {
            console.log(`server started on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()


