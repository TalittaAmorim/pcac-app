const express = require('express')

const router = express.Router() // quero entender melhor

const Job = require('../models/Job')

router.get('/', async (req, res) => {
    console.log('Pedindo todas as vagas')
    try{
        const todasVafas = await Job.getAll()

        res.json(todasAsvagas);
    }catch(err){

        console.log("Erro na rota GET /vagas: ", err.message)

        res.status(500).json({mensagem: "Algo deu errado ao buscar as vagas."})
    }
})

module.exports = router