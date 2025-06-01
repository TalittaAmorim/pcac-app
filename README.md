# PCAC - Primeira Conexão na Área de Computação 🚀

Bem-vindo ao repositório do PCAC! Este projeto é uma plataforma web destinada a ajudar novos programadores e profissionais em transição de carreira a encontrar sua primeira oportunidade na área de computação.

## 🎯 Sobre o Projeto

A PCAC (Primeira Conexão na Área de Computação) visa ser um portal focado em vagas de nível júnior, estágio e trainee, facilitando a busca para quem está começando e oferecendo um espaço para empresas que buscam novos talentos.

Este projeto está sendo desenvolvido como parte de um desafio pessoal de aprendizado e construção de um MVP (Produto Mínimo Viável) em 7 dias.

## ✨ Funcionalidades Planejadas (MVP)

* **Para Candidatos:**
    * Visualizar listagem de vagas disponíveis.
    * Ver detalhes completos de uma vaga.
    * Buscar vagas por palavras-chave (cargo, tecnologia, cidade).
    * (Opcional MVP) Filtros básicos (tipo de vaga, modalidade).
* **Para Empresas/Recrutadores:**
    * Publicar novas vagas.
    * **Validação de CNPJ da empresa no momento da publicação da vaga**, utilizando a [BrasilAPI](https://brasilapi.com.br/) para garantir a autenticidade.

## 🛠️ Tecnologias Utilizadas

* **Backend:**
    * Node.js
    * Express.js
* **Banco de Dados:**
    * SQLite
* **Frontend:**
    * HTML5
    * CSS3 (possivelmente com Tailwind CSS ou CSS puro)
    * JavaScript (para interatividade no cliente)
    * Template Engine: Handlebars.js (integrado com `express-handlebars`)
* **APIs Externas:**
    * BrasilAPI (para consulta e validação de CNPJ)
* **Desenvolvimento:**
    * Nodemon (para auto-reload durante o desenvolvimento)
    * Git & GitHub (para versionamento)

## 🚧 Status do Projeto

**Em Desenvolvimento Ativo** (Desafio de 7 dias - MVP)

* **Dia 1 (Concluído):** Estruturação inicial do projeto, setup do ambiente, instalação de dependências, configuração do Git.
* **Dia 2 (Em Andamento/Próximo):** Configuração do banco de dados SQLite, criação dos modelos iniciais, setup básico do `app.js`.
* ... (demais dias do cronograma)

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local:

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_NO_GITHUB.git>
    cd pcac-app 
    ```
    *(Substitua `<URL_DO_SEU_REPOSITORIO_NO_GITHUB.git>` pela URL real do seu repositório)*

2.  **Instale as Dependências:**
    Certifique-se de ter o Node.js e o npm instalados.
    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados:**
    O banco de dados SQLite (`database.sqlite`) e a tabela `vagas` serão criados automaticamente na primeira vez que a aplicação for iniciada (conforme configurado em `config/database.js`).

4.  **Execute a Aplicação em Modo de Desenvolvimento:**
    Este comando utiliza o `nodemon` para reiniciar o servidor automaticamente após alterações nos arquivos.
    ```bash
    npm run dev
    ```

5.  **Acesse no Navegador:**
    Abra seu navegador e acesse `http://localhost:3000` (ou a porta configurada no `app.js`).

## 📁 Estrutura do Projeto (Principais Pastas)