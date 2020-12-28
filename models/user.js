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
        items: [
            {
                count: {
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



userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseID.toString() === course._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            courseID: course._id,
            count: 1
        })
    }

    // const newCart = {items: clonedItems}
    // this.cart = newCart

    this.cart = {items}
    return this.save()
}

// Первый параметр это регистрация новой модели с схемой
module.exports = model('User', userSchema)

