module.exports = function (req, res, next) {
    // csrf & isAuth - названия придумываем сами и записываем в них то что нужно с пакетов
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    next()
}