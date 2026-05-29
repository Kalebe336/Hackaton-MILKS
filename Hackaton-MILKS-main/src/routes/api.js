const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../utils/database');
const { protegerRota } = require('../middleware/auth');

// Configuração do Multer (Upload de Exames)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- AUTH & PERFIL ---

router.post('/cadastro', async (req, res) => {
    const { nome, email, senha, idade } = req.body;
    if (db.getByEmail(email)) return res.status(400).send('E-mail já cadastrado.');
    
    const hashedPassword = await bcrypt.hash(senha, 10);
    const users = db.getAll();
    const novoUsuario = { 
        id: Date.now(), 
        nome, 
        email, 
        senha: hashedPassword, 
        idade: parseInt(idade), 
        exames: [], 
        nutricao: [], 
        sono: [] 
    };
    
    users.push(novoUsuario);
    db.saveUsers(users);
    
    req.session.usuarioLogado = novoUsuario.id;
    res.redirect('/perfil');
});

router.post('/entrar', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = db.getByEmail(email);
    
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).send('Credenciais inválidas.');
    }
    
    req.session.usuarioLogado = usuario.id;
    res.redirect('/perfil');
});

router.get('/usuario-atual', protegerRota, (req, res) => {
    const usuario = db.getById(req.session.usuarioLogado);
    if (!usuario) return res.status(404).send('Usuário não encontrado.');
    const { senha, ...userSafe } = usuario;
    res.json(userSafe);
});

router.post('/perfil/editar', protegerRota, (req, res) => {
    db.update(req.session.usuarioLogado, {
        nome: req.body.nome,
        idade: parseInt(req.body.idade)
    });
    res.redirect('/perfil');
});

router.post('/perfil/deletar', protegerRota, (req, res) => {
    db.remove(req.session.usuarioLogado);
    req.session.destroy();
    res.json({ success: true });
});

router.get('/sair', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// --- TRANSCRIÇÃO DE EXAMES ---

router.post('/transcrever', protegerRota, upload.single('fotoExame'), (req, res) => {
    const usuario = db.getById(req.session.usuarioLogado);
    const { tipoExame, valor } = req.body;
    const numValor = parseFloat(valor);
    
    let classificacao = 'Moderado';
    let mensagem = '';

    if (tipoExame === 'glicemia') {
        if (numValor < 100) { classificacao = 'Bom'; mensagem = 'Nível de açúcar em jejum normal.'; }
        else if (numValor <= 125) { classificacao = 'Moderado'; mensagem = 'Glicemia de jejum alterada (Pré-diabetes). Atenção à dieta.'; }
        else { classificacao = 'Baixo (Alerta)'; mensagem = 'Glicemia alta compatível com Diabetes. Procure um médico.'; }
    } else if (tipoExame === 'lipidio') {
        if (numValor < 190) { classificacao = 'Bom'; mensagem = 'Perfil lipídico excelente.'; }
        else if (numValor <= 239) { classificacao = 'Moderado'; mensagem = 'Colesterol limítrofe. Reduza gorduras saturadas.'; }
        else { classificacao = 'Baixo (Alerta)'; mensagem = 'Colesterol alto. Risco cardiovascular aumentado.'; }
    } else if (tipoExame === 'hepatica') {
        if (numValor <= 40) { classificacao = 'Bom'; mensagem = 'Função hepática dentro do esperado.'; }
        else if (numValor <= 55) { classificacao = 'Moderado'; mensagem = 'Enzimas levemente alteradas. Evite álcool e ultraprocessados.'; }
        else { classificacao = 'Baixo (Alerta)'; mensagem = 'Sobrecarga hepática detectada. Requer investigação médica.'; }
    } else if (tipoExame === 'tireoide') {
        if (numValor >= 0.4 && numValor <= 4.5) { classificacao = 'Bom'; mensagem = 'Hormônio tireoidiano normal.'; }
        else if (numValor > 4.5 && numValor <= 10) { classificacao = 'Moderado'; mensagem = 'TSH levemente elevado (Sinal de hipotireoidismo subclínico).'; }
        else { classificacao = 'Baixo (Alerta)'; mensagem = 'Alteração severa na tireoide. Necessita acompanhamento endocrinológico.'; }
    }

    const novoExame = {
        id: Date.now(),
        tipo: tipoExame.toUpperCase(),
        valor: numValor,
        classificacao,
        mensagem,
        foto: req.file ? `/uploads/${req.file.filename}` : null,
        data: new Date().toLocaleDateString('pt-BR')
    };

    const exames = [novoExame, ...usuario.exames];
    db.update(usuario.id, { exames });
    res.redirect('/transcricao');
});

// --- NUTRIÇÃO ---

router.post('/nutricao/adicionar', protegerRota, (req, res) => {
    const usuario = db.getById(req.session.usuarioLogado);
    const { alimento, carbo, proteina } = req.body;
    
    const nutricao = [...usuario.nutricao, {
        alimento,
        carbo: parseFloat(carbo || 0),
        proteina: parseFloat(proteina || 0),
        data: new Date().toLocaleDateString('pt-BR')
    }];
    
    db.update(usuario.id, { nutricao });
    res.redirect('/nutricao');
});

// --- SONO ---

router.post('/sono/adicionar', protegerRota, (req, res) => {
    const usuario = db.getById(req.session.usuarioLogado);
    const { horas } = req.body;
    const hrs = parseFloat(horas);
    
    let status = 'Regular';
    if (hrs >= 7 && hrs <= 9) status = 'Bom';
    else if (hrs < 6) status = 'Baixo';

    const sono = [...usuario.sono, {
        horas: hrs,
        status,
        data: new Date().toLocaleDateString('pt-BR')
    }];
    
    db.update(usuario.id, { sono });
    res.redirect('/sono');
});

module.exports = router;
