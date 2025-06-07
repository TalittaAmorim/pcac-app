# PCAC - Primeira Conexão na Área de Computação 🚀

Um portal de vagas focado em ser a ponte entre novos talentos da área de tecnologia e suas primeiras oportunidades profissionais. Este projeto foi construído como parte de um desafio de desenvolvimento de 7 dias.

### 🚀 Aplicação no Ar

**Você pode acessar a versão ao vivo do projeto aqui:** [**pcac-app.fly.dev**](https://pcac-app.fly.dev) 
*(Substitua pelo seu link real do Fly.io após o deploy)*

---
## 🎯 Sobre o Projeto

A PCAC (Primeira Conexão na Área de Computação) visa ser um portal focado em vagas de nível júnior, estágio e trainee, facilitando a busca para quem está começando e oferecendo um espaço para empresas que buscam novos talentos com potencial e vontade de aprender.

## ✨ Funcionalidades do MVP

* **Para Candidatos:**
    * Visualização da lista completa de vagas, ordenadas pelas mais recentes.
    * Página de detalhes para cada vaga com informações completas.
    * Busca funcional por palavras-chave no título e na descrição das vagas.

* **Para Empresas/Recrutadores:**
    * Formulário para publicação de novas vagas.
    * **Validação de CNPJ em tempo real** no momento do cadastro da vaga, utilizando a [BrasilAPI](https://brasilapi.com.br/) para garantir a autenticidade e a situação cadastral da empresa.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Frontend** | Handlebars.js (com `express-handlebars`), HTML5, CSS3 |
| **Banco de Dados** | SQLite com modo **WAL (Write-Ahead Logging)** ativado |
| **APIs Externas** | BrasilAPI (para consulta e validação de CNPJ) |
| **Deployment** | Fly.io com Disco Persistente (Volumes) |
| **Desenvolvimento** | Nodemon |

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/pcac-app.git](https://github.com/seu-usuario/pcac-app.git)
    cd pcac-app 
    ```
    *(Substitua pela URL real do seu repositório no GitHub)*

2.  **Instale as Dependências:**
    Certifique-se de ter o Node.js e o npm instalados.
    ```bash
    npm install
    ```

3.  **Execute a Aplicação em Modo de Desenvolvimento:**
    Este comando utiliza o `nodemon` para reiniciar o servidor automaticamente após alterações nos arquivos.
    ```bash
    npm run dev
    ```

4.  **Acesse no Navegador:**
    Abra seu navegador e acesse `http://localhost:3000`. O banco de dados (`pcac_database.sqlite`) será criado automaticamente na raiz do projeto.

## ☁️ Notas sobre o Deploy

A aplicação está hospedada na plataforma [**Fly.io**](https://fly.io/), escolhida por sua flexibilidade e suporte a volumes persistentes no plano gratuito.

* **Banco de Dados:** Para garantir a persistência dos dados com o SQLite, a aplicação utiliza um **Volume** do Fly.io, que funciona como um disco de rede anexado.
* **Otimização do SQLite:** O modo **`WAL` (Write-Ahead Logging)** do SQLite foi ativado para melhorar o desempenho e a concorrência (múltiplos acessos simultâneos), uma configuração crucial para o bom funcionamento em um ambiente de produção com disco de rede.
* **Configuração de Ambiente:** A aplicação está configurada para ouvir no host `0.0.0.0` e usar a porta fornecida pela variável de ambiente `process.env.PORT`, práticas padrão para deploy em containers.

## 🔮 Próximos Passos / Funcionalidades Futuras

* [ ] Sistema de autenticação para empresas publicarem e gerenciarem suas próprias vagas.
* [ ] Painel de controle ("Dashboard") para empresas.
* [ ] Filtros de busca avançados (por localização, tipo de contrato, etc.).
* [ ] Implementação de sistema de notificações por e-mail para novas vagas.
* [ ] Adição de testes automatizados (unitários e de integração).
* [ ] Migração para um banco de dados cliente-servidor como PostgreSQL para maior escalabilidade.

---

Desenvolvido com entusiasmo como parte de um desafio de aprendizado de 7 dias.