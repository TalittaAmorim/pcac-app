const db = require('../config/conexao');

const Job = {
    getAll: () =>{
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM vagas ORDER BY data_publicacao DESC";
            db.all(sql, [], (err,rows) =>{
                if(err){
                    console.log("Erro ao buscar todas as vagas no model: ", err.message);
                    reject(err);
                }else{
                    resolve(rows)
                }
            })
        })
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