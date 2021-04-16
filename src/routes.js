const Router = require('express')

const UsuarioController = require('./app/controllers/UsuarioController.js')
const PerfilController = require('./app/controllers/PerfilController.js')
const AcessoController = require('./app/controllers/AcessoController.js')

const routes = new Router()

const path = require('path') //Include the Path module

routes.get('/', function (request, response) {
  console.log("Bem-vindo a página inicial!")
  // response.sendFile(path.join(__dirname, './index.html'));
});


// Rotas de Usuario --------------------------------------------
routes.get('/usuarios', UsuarioController.listar); // Listar usuario
routes.get('/usuario/:id', UsuarioController.usuario); // Listar usuario especifico
routes.post('/usuario', UsuarioController.criar); // Criar um usuario
routes.delete('/usuario/:id', UsuarioController.excluir); // Deletar um usuario
routes.put('/usuario/:id', UsuarioController.atualizar); // Atualizar um usuario
// End rotas de Usuario

// Rotas de Perfil --------------------------------------------
routes.get('/perfis', PerfilController.listar); // Listar perfiis
routes.get('/perfil/:id', PerfilController.perfil); // Listar perfil especifico
routes.post('/perfil', PerfilController.criar); // Criar um perfil
routes.put('/perfil/vinculo', PerfilController.vincular); // Vincula perfil de um usuario
routes.put('/perfil/desvinculo', PerfilController.desvincular); // Desvincula perfil de um usuario
// End rotas de Perfil

// Rotas de Acesso ao sistema ---------------------------------
routes.post('/login', AcessoController.login); // Faz login no sistema
// End rotas de Acesso ao sistema



module.exports = routes
