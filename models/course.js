const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true // Обозначает что поле title необходимое для создание модели
    },
    price: {
        type: Number,
        required: true // Обозначает что поле price необходимое для создание модели
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    //Поле id по умолчанию добавляет сам Mongoose при создании модели
})
//model: первый параметр название модели, второй сама схема
module.exports = model('Course', course)