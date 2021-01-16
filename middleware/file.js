const multer = require('multer') // пакет для работы с загрузкой файлов

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images') // первый параметр ошибка, второй папка куда складывать img
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname) //
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => { // Определенная валидация для файлов
    if (allowedTypes.includes(file.mimeType)) { // проверяет есть ли файл такого типа в массиве
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})
