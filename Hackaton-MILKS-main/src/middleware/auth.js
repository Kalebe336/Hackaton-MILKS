function protegerRota(req, res, next) {
    if (req.session.usuarioLogado) {
        return next();
    }
    res.redirect('/entrar');
}

module.exports = { protegerRota };
