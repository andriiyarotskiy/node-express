const {Schema, model} = require('mongoose')

const courseSchema = new Schema({
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


courseSchema.method('toClient', function (){
    const course = this.toObject()
    course.id = course._id
    delete course._id
    return course
})

//model: первый параметр название модели, второй сама схема
module.exports = model('Course', courseSchema)