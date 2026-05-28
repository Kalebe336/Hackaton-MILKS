const express = require('express');
const router = express.Router();
const path = require('path');
const { protegerRota } = require('../middleware/auth');

// Rota Principal (Landing Page)
router.get('/', (req, res) => {
    if (req.session.usuarioLogado) return res.redirect('/perfil');
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});

// Autenticação
router.get('/entrar', (req, res) => res.sendFile(path.join(__dirname, '../../views/entrar.html')));
router.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, '../../views/cadastro.html')));

// Áreas Logadas
router.get('/perfil', protegerRota, (req, res) => res.sendFile(path.join(__dirname, '../../views/perfil.html')));
router.get('/transcricao', protegerRota, (req, res) => res.sendFile(path.join(__dirname, '../../views/transcricao.html')));
router.get('/nutricao', protegerRota, (req, res) => res.sendFile(path.join(__dirname, '../../views/nutricao.html')));
router.get('/sono', protegerRota, (req, res) => res.sendFile(path.join(__dirname, '../../views/sono.html')));

module.exports = router;
