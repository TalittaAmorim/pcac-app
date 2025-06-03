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

router.get('/nova', (req, res) => {
    console.log("LOG: Requisição recebida em GET /vagas/nova");
    res.send('Página com o formulário para adicionar uma NOVA VAGA aparecerá aqui!');
});

router.post('/', async (req, res) =>{

    try{
        const { titulo, empresa, descricao, localizacao, email_contato, cnpj_empresa } = req.body;
        
        // valida se preencheu todos os dados
        if (!titulo || !descricao || !email_contato || !cnpj_empresa) {
            return res.status(400).json({ mensagem: "Campos obrigatórios não preenchidos: título, descrição, e-mail de contato e CNPJ." });
        }

        const cnpjLimpo = cnpj_empresa.replace(/[^\d]+/g, ''); 
        if (!cnpjLimpo || cnpjLimpo.length !== 14) {
             return res.status(400).json({ mensagem: "Formato de CNPJ inválido. Deve conter 14 números." });
        }

        console.log(`LOG: Validando CNPJ: ${cnpjLimpo} com BrasilAPI`);
        const urlBrasilAPI = `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`;
        const respostaBrasilAPI = await fetch(urlBrasilAPI);


        if (!respostaBrasilAPI.ok) {
            // Se a BrasilAPI retornar um erro (ex: CNPJ não encontrado lá, ou API fora do ar)
            const erroApi = await respostaBrasilAPI.json().catch(() => ({ mensagem: "CNPJ não encontrado ou inválido na consulta externa."}));
            console.warn("LOG: Erro ao consultar BrasilAPI:", respostaBrasilAPI.status, erroApi);
            return res.status(400).json({ 
                mensagem: "Não foi possível validar o CNPJ. Verifique o número ou tente mais tarde.",
                detalhe_api: erroApi.message || (erroApi.errors && erroApi.errors.length > 0 ? erroApi.errors[0].message : "CNPJ não encontrado")
            });
        }

        const dadosCnpj = await respostaBrasilAPI.json();

        if (dadosCnpj.situacao_cadastral !== 'ATIVA') {
            console.warn("LOG: CNPJ não está ATIVO:", dadosCnpj.situacao_cadastral, dadosCnpj.razao_social);
            return res.status(400).json({ mensagem: `CNPJ ${dadosCnpj.cnpj} (${dadosCnpj.razao_social}) não está com situação ATIVA. Situação: ${dadosCnpj.situacao_cadastral}` });
        }
        console.log("LOG: CNPJ validado e ATIVO:", dadosCnpj.razao_social);

        const dadosDaNovaVaga = {
            titulo,
            empresa: empresa || dadosCnpj.nome_fantasia || dadosCnpj.razao_social, // Usa o nome da empresa do form ou da API
            descricao,
            localizacao,
            email_contato,
            cnpj_empresa: dadosCnpj.cnpj // Usa o CNPJ formatado da API
        };

        const vagaCriada = await Job.create(dadosDaNovaVaga);
        res.status(201).json(vagaCriada); 
    }catch(err){
        console.error("LOG: Erro na rota POST /vagas:", err.message, err.stack);
        // Verifica se o erro é da consulta fetch para a BrasilAPI
        if (err.name === 'FetchError' || (err.message && err.message.includes('fetch'))) {
             res.status(503).json({ mensagem: "Erro ao comunicar com o serviço de validação de CNPJ. Tente novamente mais tarde." });
        } else {
             res.status(500).json({ mensagem: "Ops! Algo deu errado ao criar a vaga." });
        }

    }
})

router.get('/:idDaVaga', async (req, res) => {
    const idParaBuscar = req.params.idDaVaga;
    console.log(`LOG: Requisição recebida em GET /vagas/${idParaBuscar}`);
    try {
        // Validação simples para ver se o ID é um número
        if (isNaN(parseInt(idParaBuscar))) {
            return res.status(400).json({ mensagem: "ID da vaga inválido. Deve ser um número." });
        }

        const vaga = await Job.getById(idParaBuscar);

        if (vaga) {
            res.json(vaga);
        } else {
            res.status(404).json({ mensagem: `Vaga com ID ${idParaBuscar} não encontrada.` });
        }
    } catch (err) {
        console.error(`LOG: Erro na rota GET /vagas/${idParaBuscar}:`, err.message);
        res.status(500).json({ mensagem: "Erro interno ao buscar detalhes da vaga." });
    }
});



module.exports = router