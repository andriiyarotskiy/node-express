const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')
const ordersRouter = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')


const MONGODB_URI = 'mongodb+srv://Andrii:N9RofYUiK19lRPRp@cluster0.cmkhw.mongodb.net/shop'

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // доступ к прототипам после обновлений handlebars
})
// создаем store обьект с данными для БД
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('5fe9a7a87b5a9e3b30f7ff08')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//     }
// })

// app.use - метод позволяет добавлять новые middleware, новую функциональность для приложения
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
// обьект store подключаем в сесию
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)

// первый параметр указывает путь второй роутер на файл
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/card', cardRouter)
app.use('/orders', ordersRouter)
app.use('/auth', authRoutes)

const PORT = process.env.port || 3000


const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { //Connect - метод подключается к БД
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'andriiyarotskiy@gmail.com',
        //         name: 'Andriy',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }

        app.listen(PORT, () => {
            console.log(`server started on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()


