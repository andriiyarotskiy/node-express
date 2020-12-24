const {Schema, model} = require('mongoose')


//Пользователь
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        item: [
            {
                count:{
                    type: Number,
                    required: true,
                    default: 1
                },
                courseID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course', // Название должно совпадать с models course
                    required: true,
                }
            }
        ]
    }
})
// Первый параметр это регистрация новой модели с схемой
module.exports = model('User', userSchema)