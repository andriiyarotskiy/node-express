module.exports = {
    ifeq(a, b, options) {
        // Коректно сравнивает только когда приводить к строке
        if (a == b) { // or ==
            return options.fn(this)
        }
        return options.inverse(this)
    }
}
