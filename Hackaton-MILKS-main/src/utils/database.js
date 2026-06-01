const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../usuarios.json');

// Garantir que o arquivo exista
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function loadUsers() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Erro ao salvar usuários:", err);
    }
}

module.exports = {
    loadUsers,
    saveUsers,
    getAll: loadUsers,
    getById: (id) => loadUsers().find(u => u.id === id),
    getByEmail: (email) => loadUsers().find(u => u.email === email),
    update: (id, data) => {
        const users = loadUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...data };
            saveUsers(users);
            return users[index];
        }
        return null;
    },
    remove: (id) => {
        const users = loadUsers().filter(u => u.id !== id);
        saveUsers(users);
    }
};
