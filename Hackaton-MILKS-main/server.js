const express = require('express');
const session = require('express-session');
const path = require('path');

// Importar Rotas
const viewRoutes = require('./src/routes/views');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'vitaprev_secret_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Em produção com HTTPS, usar true
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Definição das Rotas
app.use('/', viewRoutes);
app.use('/api', apiRoutes);

// Tratamento de erro 404 (Página não encontrada)
app.use((req, res) => {
    res.status(404).send('Página não encontrada no VitaPrev.');
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 VitaPrev Backend Modular Online!`);
    console.log(`🔗 Link: http://localhost:${PORT}`);
    console.log(`=========================================`);
});
