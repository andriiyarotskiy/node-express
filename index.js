const express = require('express')
const path = require('path')
const csrf = require('csurf')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')
const ordersRouter = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const fileUpload = require('express-fileupload');

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
// const fileMiddleware = require('./middleware/file')

const keys = require('./keys')

const PORT = process.env.PORT || 3000

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars) // доступ к прототипам после обновлений handlebars
})
// создаем store обьект с данными для БД
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


// app.use - метод позволяет добавлять новые middleware, новую функциональность для приложения
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'img')))
app.use(express.urlencoded({extended: true}))
// обьект store подключаем в сесию
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(fileUpload({}));

// app.use(fileMiddleware.single('avatar'))
// Добавление CSRF-защиты
app.use(csrf())
app.use(flash())
app.use(helmet({ // headers titles
    contentSecurityPolicy: false,
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)


// первый параметр указывает путь второй роутер на файл
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/card', cardRouter)
app.use('/orders', ordersRouter)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler)


const start = async () => {
    try {
        await mongoose.connect(keys.MONGODB_URI, { //Connect - метод подключается к БД
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`server started on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()


