import * as Yup from 'yup'
import Perfis from "../models/Perfis.js"
import Usuarios from "../models/Usuarios.js"

class PerfilController {

/**
 * Aqui são listados os perfis
 * routes.get('/perfis', UsuarioController.listar);
 */
  async listar (request, response) {
    await Perfis.find({})
    .then(function (perfisResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de perfis', retorno: perfisResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar os perfis cadastrados'})
    })
  }
  
/**
 * Aqui lista dados de um perfil específico
 * routes.get('/perfil/:id', UsuarioController.usuario);
 */
  async perfil (request, response) {
    await Perfis.findOne({_id: request.params.id})
    .then(function (perfilResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados do perfil', retorno: perfiloResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados do perfil com id informado'})
    })
  }
  
/**
 * Aqui são gravados os dados de perfil
 * routes.post('/perfil', UsuarioController.criar);
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
      nome: Yup.string().required().min(5)
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    // Se o nome já foi usado
    const perfilExiste = await Perfis.findOne({nome: request.body.nome})
    if (perfilExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Este perfil já esta em uso! Informe outro'})
    }
    const perfil = await Perfis.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar perfil'})
      }
    })
    return response.status(200).json({codigo: 6, mensagem: 'Perfis OK!'})
  }

/**
 * Aqui é vinculado um perfil ao um usuario
 * routes.put('/perfil/vinculo', UsuarioController.vincular);
 */
  async vincular (request, response) {
    const schema = Yup.object().shape({
      idUsuario: Yup.string().required(),
      idPerfil: Yup.string().required()
    })

    // Validar se os dados mínimos estão preenchidos
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }

// TODO colocar os returns com os erros de não localizado
    const usuarioExiste = await Usuarios.findOne({_id: request.body.idUsuario})
    const perfilExiste = await Perfis.findOne({_id: request.body.idPerfil})
    const vinculoExiste = await Usuarios.findOne({_id: request.body.idUsuario, 'perfis.nome': perfilExiste.nome })

    if (vinculoExiste) {
      return response.status(400).json({codigo: 109, mensagem: 'Já existe este vinculo de usuário e perfil'})
    }

    usuarioExiste.perfis.push(perfilExiste)

    await Usuarios.updateOne({_id: request.body.idUsuario}, usuarioExiste)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Usuario atualizado com novo perfil', retorno: usuarioExiste})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar usuario com perfil'})
    })
  }

/**
 * Aqui é desvinculado um perfil de um usuario
 * routes.put('/perfil/desvinculo', UsuarioController.vincular);
 */
  async desvincular (request, response) {
    const schema = Yup.object().shape({
      idUsuario: Yup.string().required(),
      idPerfil: Yup.string().required()
    })

    // Validar se os dados mínimos estão preenchidos
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }

    const perfil = await Perfis.findOne({_id: request.body.idPerfil})

    await Usuarios.update( {_id: request.body.idUsuario}, { $pull: {perfis: {nome: perfil.nome } } } )

    return response.status(200).json({codigo: 0, mensagem: 'Atualizado!'})
  }

}

export default new PerfilController()