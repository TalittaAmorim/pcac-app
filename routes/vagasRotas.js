const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
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

    console.log(
      "LOG: Vagas encontradas:",
      todasAsVagas ? todasAsVagas.length : 0
    );
    res.render("vagas/lista_vagas", {
      vagas: todasAsVagas,
      paginaTitulo: "Encontre sua Vaga na PCAC",
      query: req.query,
      layout: "main",
    });
  } catch (err) {
    console.error("LOG: Erro na rota GET /vagas:", err.message, err.stack);
    res.status(500).render("error", {
      mensagemErro: "Ops! Algo deu errado ao buscar as vagas.",
      paginaTitulo: "Erro",
      layout: "main",
    });
  }
});

router.get("/nova_vaga_form", async (req, res) => {
  console.log("LOG: Requisição recebida em GET /vagas/nova");
  try {
    res.render("vagas/nova_vaga_form", {
      paginaTitulo: "Publicar Nova Vaga",
      vaga: {}, // Passa um objeto vaga vazio para evitar erros no template se ele tentar acessar vaga.titulo etc.
      layout: "main",
    });
  } catch (err) {
    console.error("LOG: Erro na rota GET /vagas/nova:", err.message, err.stack);
    res.status(500).render("error", {
      mensagemErro:
        "Ops! Algo deu errado ao carregar o formulário de nova vaga.",
      paginaTitulo: "Erro",
      layout: "main",
    });
  }
});

router.post("/", async (req, res) => {
  console.log("LOG: Requisição POST /vagas recebida com dados:", req.body);
  const dadosFormulario = {
    titulo: req.body.titulo,
    empresa: req.body.empresa,
    descricao: req.body.descricao,
    localizacao: req.body.localizacao,
    email_contato: req.body.email_contato,
    cnpj_empresa: req.body.cnpj_empresa,
  };

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
        const fetchOptions = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            }
        };
        
        console.log(`LOG: URL da BrasilAPI sendo chamada: ${urlBrasilAPI}`);
        const respostaBrasilAPI = await fetch(urlBrasilAPI, fetchOptions);
        
        console.log(`LOG: Status da resposta da BrasilAPI: ${respostaBrasilAPI.status} ${respostaBrasilAPI.statusText}`);

        let dadosCorpoResposta;
        try {
            dadosCorpoResposta = await respostaBrasilAPI.json(); 
        } catch (jsonError) {
            console.error("LOG: Falha ao parsear resposta da BrasilAPI como JSON:", jsonError);
            const textoErro = await respostaBrasilAPI.text().catch(() => "Corpo da resposta ilegível.");
            console.error("LOG: Corpo da resposta da BrasilAPI como texto:", textoErro);
            return res.status(respostaBrasilAPI.status || 500).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: `Erro ao processar resposta do serviço de CNPJ. Status: ${respostaBrasilAPI.status}. Detalhe: ${textoErro.substring(0,100)}`,
                vaga: dadosFormulario,
                layout: 'main'
            });
        }

        if (!respostaBrasilAPI.ok) {
            console.warn("LOG: Erro na consulta à BrasilAPI (status não OK):", dadosCorpoResposta);
            return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: `Falha ao validar CNPJ: ${dadosCorpoResposta.message || dadosCorpoResposta.type || 'Serviço de CNPJ retornou um erro.'}`,
                vaga: dadosFormulario,
                layout: 'main'
            });
        }
        
        console.log("LOG: Dados JSON completos do CNPJ recebidos da BrasilAPI:", dadosCorpoResposta);

        if (!dadosCorpoResposta || dadosCorpoResposta.descricao_situacao_cadastral !== 'ATIVA') {
            console.warn("LOG: CNPJ não está ATIVO ou dadosCnpj é inválido. Situação:", dadosCorpoResposta ? dadosCorpoResposta.descricao_situacao_cadastral : 'DadosCnpj não definidos', "Razão Social:", dadosCorpoResposta ? dadosCorpoResposta.razao_social : 'DadosCnpj não definidos');
            return res.status(400).render('vagas/nova_vaga_form', {
                paginaTitulo: 'Publicar Nova Vaga',
                erro: `CNPJ ${dadosCorpoResposta ? dadosCorpoResposta.cnpj : cnpjLimpo} (${dadosCorpoResposta ? dadosCorpoResposta.razao_social : 'Empresa'}) não está com situação ATIVA ou não pôde ser validado. Situação: ${dadosCorpoResposta ? dadosCorpoResposta.descricao_situacao_cadastral : 'Desconhecida'}`,
                vaga: dadosFormulario,
                layout: 'main'
            });
        }

        console.log("LOG: CNPJ validado e ATIVO:", dadosCorpoResposta.razao_social);
        
        const dadosParaSalvar = {
            ...dadosFormulario,
            empresa: dadosFormulario.empresa || dadosCorpoResposta.nome_fantasia || dadosCorpoResposta.razao_social,
            cnpj_empresa: dadosCorpoResposta.cnpj 
        };

        const vagaCriada = await Job.create(dadosParaSalvar);
        res.redirect(`/vagas/${vagaCriada.id}?sucesso=Vaga+publicada+com+sucesso`);
});

router.get("/:idDaVaga", async (req, res) => {
  const idParaBuscar = req.params.idDaVaga;
  console.log(`LOG: Requisição recebida em GET /vagas/${idParaBuscar}`);
  try {
    if (isNaN(parseInt(idParaBuscar))) {
      return res.status(400).render("error", {
        paginaTitulo: "Erro",
        mensagemErro: "ID da vaga inválido. Deve ser um número.",
        layout: "main",
      });
    }

    const vaga = await Job.getById(idParaBuscar);
    const mensagemSucesso = req.query.sucesso; // Pega a mensagem de sucesso da URL, se houver

    if (vaga) {
      res.render("vagas/detalhe_vaga", {
        vaga: vaga,
        paginaTitulo: vaga.titulo + " - PCAC",
        sucesso: mensagemSucesso, // Passa a mensagem de sucesso para a view
        layout: "main",
      });
    } else {
      res.status(404).render("error", {
        paginaTitulo: "Vaga não Encontrada",
        mensagemErro: `Vaga com ID ${idParaBuscar} não encontrada.`,
        layout: "main",
      });
    }
  } catch (err) {
    console.error(
      `LOG: Erro na rota GET /vagas/${idParaBuscar}:`,
      err.message,
      err.stack
    );
    res.status(500).render("error", {
      paginaTitulo: "Erro",
      mensagemErro: "Erro interno ao buscar detalhes da vaga.",
      layout: "main",
    });
  }
});

module.exports = router;
