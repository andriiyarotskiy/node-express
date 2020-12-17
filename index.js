const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


// app.use - метод позволяет добавлять новые middleware, новую функциональность для приложения
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// первый параметр указывает путь второй роутер на файл
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/card', cardRouter)

const PORT = process.env.port || 3000

app.listen(3000, () => {
    console.log(`server started on port: ${PORT}`)
})