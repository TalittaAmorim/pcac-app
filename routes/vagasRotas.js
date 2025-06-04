const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Ajustado para 'jobModel.js' (verifique o nome do seu arquivo)

router.get('/', async (req, res) => {
    console.log("LOG: Requisição recebida em GET /vagas");
    try {
        const queryKeywords = req.query.keywords;
        let todasAsVagas;

        if (queryKeywords) {
            console.log(`LOG: Buscando por keywords: ${queryKeywords}`);
            todasAsVagas = await Job.getAll(); 
        } else {
            todasAsVagas = await Job.getAll();
        }

        console.log("LOG: Vagas encontradas:", todasAsVagas ? todasAsVagas.length : 0);
        res.render('vagas/lista_vagas', { 
            vagas: todasAsVagas, 
            paginaTitulo: 'Encontre sua Vaga na PCAC',
            query: req.query,
            layout: 'main'
        });
    } catch (err) {
        console.error("LOG: Erro na rota GET /vagas:", err.message, err.stack);
        res.status(500).render('error', { 
            mensagemErro: "Ops! Algo deu errado ao buscar as vagas.",
            paginaTitulo: "Erro",
            layout: 'main' 
        });
    }
});

router.get('/nova_vaga_form', async (req, res) => { // Caminho ajustado para '/nova'
    console.log("LOG: Requisição recebida em GET /vagas/nova");
    try {
        res.render('vagas/nova_vaga_form', { 
            paginaTitulo: 'Publicar Nova Vaga',
            vaga: {}, // Passa um objeto vaga vazio para evitar erros no template se ele tentar acessar vaga.titulo etc.
            layout: 'main'
        });
    } catch (err) {
        console.error("LOG: Erro na rota GET /vagas/nova:", err.message, err.stack);
        res.status(500).render('error', { 
            mensagemErro: "Ops! Algo deu errado ao carregar o formulário de nova vaga.",
            paginaTitulo: "Erro",
            layout: 'main' 
        });
    }
});

router.post('/', async (req, res) => {
    console.log("LOG: Requisição POST /vagas recebida com dados:", req.body);
    const dadosFormulario = {
        titulo: req.body.titulo,
        empresa: req.body.empresa,
        descricao: req.body.descricao,
        localizacao: req.body.localizacao,
        email_contato: req.body.email_contato,
        cnpj_empresa: req.body.cnpj_empresa 
    };

    try {
        if (!dadosFormulario.titulo || !dadosFormulario.descricao || !dadosFormulario.email_contato || !dadosFormulario.cnpj_empresa) {
            return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: 'Preencha todos os campos obrigatórios (*).',
                vaga: dadosFormulario,
                layout: 'main'
            });
        }

        const cnpjLimpo = dadosFormulario.cnpj_empresa.replace(/[^\d]+/g, '');
        if (!cnpjLimpo || cnpjLimpo.length !== 14) {
             return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: 'Formato de CNPJ inválido. Deve conter 14 números.',
                vaga: dadosFormulario,
                layout: 'main'
            });
        }

        console.log(`LOG: Validando CNPJ: ${cnpjLimpo} com BrasilAPI`);
        const urlBrasilAPI = `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`;
        
        console.log(`LOG: URL da BrasilAPI sendo chamada: ${urlBrasilAPI}`);
        const respostaBrasilAPI = await fetch(urlBrasilAPI);
        console.log(`LOG: Status da resposta da BrasilAPI: ${respostaBrasilAPI.status} ${respostaBrasilAPI.statusText}`);

        if (!respostaBrasilAPI.ok) {
            let corpoErroApi = await respostaBrasilAPI.text();
            console.error(`LOG: Corpo do erro da BrasilAPI (texto puro): ${corpoErroApi}`);
            let erroApiDetalhado;
            try {
                erroApiDetalhado = JSON.parse(corpoErroApi);
            } catch (e) {
                console.warn("LOG: Resposta de erro da BrasilAPI não era JSON válido.");
                erroApiDetalhado = { message: "Não foi possível processar a resposta do serviço de CNPJ.", details: corpoErroApi };
            }
            
            console.warn("LOG: Detalhes do erro da BrasilAPI:", erroApiDetalhado);
            return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: `Falha ao validar CNPJ: ${erroApiDetalhado.message || erroApiDetalhado.type || 'Serviço de CNPJ indisponível ou CNPJ não encontrado.'}`,
                vaga: dadosFormulario,
                layout: 'main'
            });
        }

        const dadosCnpj = await respostaBrasilAPI.json();
        if (dadosCnpj.descricao_situacao_cadastral !== 'ATIVA') {
            console.warn("LOG: CNPJ não está ATIVO:", dadosCnpj.descricao_situacao_cadastral, dadosCnpj.razao_social);
            return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: `CNPJ ${dadosCnpj.cnpj} (${dadosCnpj.razao_social || 'Empresa'}) não está com situação ATIVA. Situação: ${dadosCnpj.descricao_situacao_cadastral}`,
                vaga: dadosFormulario,
                layout: 'main'
            });
        }
        console.log("LOG: CNPJ validado e ATIVO:", dadosCnpj.razao_social);
        
        const dadosParaSalvar = {
            ...dadosFormulario,
            empresa: dadosFormulario.empresa || dadosCnpj.nome_fantasia || dadosCnpj.razao_social,
            cnpj_empresa: dadosCnpj.cnpj
        };

        const vagaCriada = await Job.create(dadosParaSalvar);
        
        res.redirect(`/vagas/${vagaCriada.id}?sucesso=Vaga+publicada+com+sucesso`); 

    } catch (err) {
        console.error("LOG: Erro crítico na rota POST /vagas:", err.message, err.stack);
        res.status(500).render('vagas/nova_vaga_form', {
            paginaTitulo: 'Publicar Nova Vaga',
            erro: 'Ops! Algo deu muito errado ao tentar publicar sua vaga. Tente mais tarde.',
            vaga: dadosFormulario,
            layout: 'main'
        });
    }
});

router.get('/:idDaVaga', async (req, res) => {
    const idParaBuscar = req.params.idDaVaga;
    console.log(`LOG: Requisição recebida em GET /vagas/${idParaBuscar}`);
    try {
        if (isNaN(parseInt(idParaBuscar))) {
            return res.status(400).render('error', {
                paginaTitulo: 'Erro',
                mensagemErro: 'ID da vaga inválido. Deve ser um número.',
                layout: 'main'
            });
        }

        const vaga = await Job.getById(idParaBuscar);
        const mensagemSucesso = req.query.sucesso; // Pega a mensagem de sucesso da URL, se houver

        if (vaga) {
            res.render('vagas/detalhe_vaga', {
                vaga: vaga,
                paginaTitulo: vaga.titulo + " - PCAC",
                sucesso: mensagemSucesso, // Passa a mensagem de sucesso para a view
                layout: 'main'
            });
        } else {
            res.status(404).render('error', {
                paginaTitulo: 'Vaga não Encontrada',
                mensagemErro: `Vaga com ID ${idParaBuscar} não encontrada.`,
                layout: 'main'
            });
        }
    } catch (err) {
        console.error(`LOG: Erro na rota GET /vagas/${idParaBuscar}:`, err.message, err.stack);
        res.status(500).render('error', {
            paginaTitulo: 'Erro',
            mensagemErro: "Erro interno ao buscar detalhes da vaga.",
            layout: 'main'
        });
    }
});

module.exports = router;
