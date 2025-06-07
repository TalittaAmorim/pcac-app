const express = require('express');
const app = express();
const PORTA = process.env.PORT || 3002;
const vagasRoutes = require('./routes/vagasRotas'); 
const path = require('path');
const { engine } = require('express-handlebars'); 

const db = require('./config/conexao.js')


app.engine(
    'hbs', // Define um nome para o motor de template
    engine({ // Chama a função 'engine' que importamos, passando um objeto de configuração
        extname: '.hbs', 
        defaultLayout: 'main',
                               // Ele vai procurar por views/layouts/main.hbs
        layoutsDir: path.join(__dirname, 'views/layouts'), // Caminho completo para a pasta onde seus layouts estão
                                                           // __dirname é a pasta atual (onde app.js está)
        partialsDir: path.join(__dirname, 'views/partials'), 
        helpers: { // (Opcional, mas útil) Define funções auxiliares para usar nos templates
            currentYear: () => {
                return new Date().getFullYear();
            },
            formatDate: (dateString) => {
                if (!dateString) return '';
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                return new Date(dateString).toLocaleDateString('pt-BR', options);
            },

            substring: function(string, start, end) { 
                
        if (string && typeof string === 'string') {
            return string.substring(start, end);
        }
        return '';
    }

        }
    })
);

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {

  res.render('home', {
    paginaTitulo: "Bem vindo"
  })
});

app.get('/sobre', (req, res) => {

  res.render('sobre', {
    paginaTitulo: "Bem vindo",
  })
});


app.use('/vagas', vagasRoutes); // MONTA AS ROTAS DE VAGAS NO CAMINHO /vagas


const host = '0.0.0.0';

app.listen(PORTA, host, () => {
    console.log(`🎉 oba! A casa PCAC abriu na porta <span class="math-inline">\{PORTA\}\! Visite em http\://</span>{host}:${PORTA}`);
});

