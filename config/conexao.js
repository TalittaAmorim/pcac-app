const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // dependência para n ter problemas com caminhos

const BANCO = 'banco_vagas.sqlite'

const bancoFile = process.env.RENDER
    ? `/var/data/${BANCO}`
    : path.resolve(__dirname, '..', BANCO);

const db = new sqlite3.Database(bancoFile, (err) =>{
    if (err) {
        console.log('Erro ao conectar o banco de dados', err.message);
    }
    else{
        console.log(`Conectado ao banco de dados: ${bancoFile}`);
        criarTabela()
    }
})

function criarTabela() {
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
                console.error(" Erro ao criar tabela 'vagas':", err.message);
            } else {
                console.log(" Tabela 'vagas' verificada/criada com sucesso.");
            }
        });
    });
}

module.exports = db;