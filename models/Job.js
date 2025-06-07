const db = require('../config/conexao');

const Job = {

    getAll: (keywords) => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM vagas";
            const params = [];

            if (keywords) {
                // Se recebemos keywords, modificamos a query SQL para filtrar
                sql += " WHERE titulo LIKE ? OR descricao LIKE ?"; // Adiciona a condição de busca
                params.push(`%${keywords}%`, `%${keywords}%`); // Adiciona os valores para os '?'
            }

            sql += " ORDER BY data_publicacao DESC"; // Adiciona a ordenação no final

            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error("Erro ao buscar vagas no model:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    getById: (id) =>{
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM vagas WHERE id =?";
            db.get(sql, [id], (err,row) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            });
        });
    },

    create: (vagaData) => {

        const { titulo, empresa, descricao, localizacao, email_contato, cnpj_empresa } = vagaData;
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO vagas (titulo, empresa, descricao, localizacao, email_contato, cnpj_empresa)
                        VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(sql, [titulo, empresa, descricao, localizacao, email_contato, cnpj_empresa], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...vagaData }); // Retorna a vaga com o ID
                }
            });
        });
    }

}

module.exports = Job