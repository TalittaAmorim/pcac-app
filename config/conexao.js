const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE_NAME = 'pcac_database.sqlite';

const onFly = process.env.FLY_APP_NAME !== undefined;

const dbPath = onFly
    ? `/data/${DB_FILE_NAME}`
    : path.resolve(__dirname, '..', DB_FILE_NAME);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar/abrir o banco de dados:', err.message);
    } else {
        console.log(`Conectado ao banco de dados SQLite: ${DB_FILE_NAME}`);
        
        db.run('PRAGMA journal_mode = WAL;', (walErr) => {
            if (walErr) {
                console.error("Erro ao habilitar modo WAL:", walErr.message);
            } else {
                console.log("Modo WAL habilitado com sucesso.");
                criarTabelasSeNaoExistirem();
            }
        });
    }
});

function criarTabelasSeNaoExistirem() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS vagas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                empresa TEXT,
                descricao TEXT NOT NULL,
                localizacao TEXT,
                email_contato TEXT NOT NULL,
                data_publicacao DATETIME DEFAULT (datetime('now','localtime')),
                cnpj_empresa TEXT
            )
        `, (err) => {
            if (err) {
                console.error("Erro ao criar tabela 'vagas':", err.message);
            } else {
                console.log("Tabela 'vagas' verificada/criada com sucesso.");
            }
        });
    });
}

module.exports = db;