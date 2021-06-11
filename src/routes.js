import { Router } from "express"
import UsuarioController from "./app/controllers/UsuarioController.js"
import path from "path"
import { fileURLToPath } from 'url'
import authMiddleware from "./middlewares/auth.js"

const routes = new Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url));

routes.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, './index.html'));
});

// Rotas de Login  ---------------------------------
routes.post('/login', UsuarioController.login);
routes.post('/signin', UsuarioController.criaUsuario);
// End rotas de login


// Rotas de Usuario Autenticado --------------------------------------------
routes.get('/profile', authMiddleware, UsuarioController.dadosUsuario);
routes.put('/profile/:id', authMiddleware, UsuarioController.atualizaUsuario);
routes.delete('/profile/:id', authMiddleware, UsuarioController.excluiUsuario);
// End rotas de Usuario Autenyicado


// Rotas de Posts Usuario --------------------------------------------
routes.get('/profile/posts', UsuarioController.listaTodosPostUsuario);
routes.get('/profile/posts/:id', UsuarioController.listaPostUsuario);
routes.post('/profile/posts', UsuarioController.adicionaPostUsuario);
routes.put('/profile/posts/:id', UsuarioController.editaPostUsuario);
routes.delete('/profile/posts/:id', UsuarioController.excluiPostUsuario);
// End rotas de Posts Usuario


// Rotas públicas de Usuarios --------------------------------------------
routes.get('/users', UsuarioController.listaTodosUsuario);
routes.get('/users/:id', UsuarioController.listaUsuarioEspecifico);
routes.get('/users/:id_user/posts', UsuarioController.listaPostsUsuarioEspecifico);
routes.get('/users/:id_user/posts/:id_post', UsuarioController.postUsuarioEspecifico);
// End rotas públicas de Usuarios



export default routes