import { Router } from "express"
import UsuarioController from "./app/controllers/UsuarioController.js"
import PerfilController from "./app/controllers/PerfilController.js"
import AcessoController from "./app/controllers/AcessoController.js"
import MedicosController from "./app/controllers/MedicosController.js"
import EspecialidadesController from "./app/controllers/EspecialidadesController.js"
import ConveniosController from "./app/controllers/ConveniosController.js"
import ServicosController from "./app/controllers/ServicosController.js"
import PacientesController from "./app/controllers/PacientesController.js"
import AgendasController from "./app/controllers/AgendasController.js"
import path from "path"
import { fileURLToPath } from 'url';

const routes = new Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url));

routes.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, './index.html'));
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


// Rotas de Medicos --------------------------------------------
routes.get('/medicos', MedicosController.listar); // Listar medicos
routes.get('/medico/:id', MedicosController.medicos); // Listar medico especifico
routes.post('/medico', MedicosController.criar); // Criar um medico
routes.delete('/medico', MedicosController.excluir); // Excluir um medico
routes.put('/medico/:id', MedicosController.atualizar); // Atualizar um medico
routes.put('/medico/vincular', MedicosController.vincular); // Vincula especialidade a um medico
routes.put('/medico/desvincular', MedicosController.desvincular); // Desvincula especialidade de um medico
// End rotas de Medicos


// Rotas de Especialidades --------------------------------------------
routes.get('/especialidades', EspecialidadesController.listar); // Listar especialidades
routes.get('/especialidade/:id', EspecialidadesController.especialidade); // Listar especialidade especifica
routes.post('/especialidade', EspecialidadesController.criar); // Criar uma especialidade
routes.delete('/especialidade', EspecialidadesController.excluir); // Excluir uma especialidade
routes.put('/especialidade/:id', EspecialidadesController.atualizar); // Atualizar uma especialidade
routes.put('/especialidade/vincular', EspecialidadesController.vincular); // Vincula serviço a uma especialidade
routes.put('/especialidade/desvincular', EspecialidadesController.desvincular); // Desvincula serviço de uma especialidade
// End rotas de Especialidades


// Rotas de Servicos --------------------------------------------
routes.get('/servicos', ServicosController.listar); // Listar servicos
routes.get('/servico/:id', ServicosController.servico); // Listar servico especifico
routes.post('/servico', ServicosController.criar); // Criar um servico
routes.delete('/servico', ServicosController.excluir); // Excluir um servico
routes.put('/servico/:id', ServicosController.atualizar); // Atualizar um servico
// End rotas de Servicos


// Rotas de Convenios --------------------------------------------
routes.get('/convenios', ConveniosController.listar); // Listar Convenios
routes.get('/convenios/:id', ConveniosController.convenio); // Listar convenios especifico
routes.post('/convenios', ConveniosController.criar); // Criar um convenio
routes.put('/convenios/:id', ConveniosController.atualizar); // Atualizar um convenio
routes.put('/convenios/vigencia/:id', ConveniosController.vigencia); // Verifica se convenio está vigente
// End rotas de Convenios


// Rotas de Pacientes --------------------------------------------
routes.get('/pacientes', PacientesController.listar); // Listar pacientes
routes.get('/paciente/:id', PacientesController.paciente); // Listar paciente especifico
routes.post('/paciente', PacientesController.criar); // Criar um paciente
routes.delete('/paciente', PacientesController.excluir); // Excluir um paciente
routes.put('/paciente/:id', PacientesController.atualizar); // Atualizar um paciente
routes.put('/paciente/vincular', PacientesController.vincular); // Vincula especialidade a um paciente
routes.put('/paciente/desvincular', PacientesController.desvincular); // Desvincula especialidade de um paciente
// End rotas de Pacientes


// Rotas de Agendas --------------------------------------------
routes.get('/agenda', AgendasController.listar); // Listar agendamentos
routes.get('/agenda/:id', AgendasController.agenda); // Listar agendamento especifico
routes.get('/agenda/periodo', AgendasController.listarPeriodo); // Listar agendamentos em um Período
routes.post('/agenda', AgendasController.criar); // Criar um agendamento
routes.delete('/agenda', AgendasController.excluir); // Excluir um agendamento
routes.put('/agenda/:id', AgendasController.atualizar); // Atualizar um agendamento
// End rotas de Agendas


// Rotas de Acesso ao sistema ---------------------------------
routes.post('/login', AcessoController.login); // Faz login no sistema
// End rotas de Acesso ao sistema

export default routes