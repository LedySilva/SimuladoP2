import * as Yup from 'yup'
import * as bcrypt from 'bcryptjs'
import Usuarios from "../models/Usuarios.js"

class UsuarioController {

/**
 * Aqui são listados os usuarios
 */
  async listar (request, response) {
    await Usuarios.find({})
    .then(function (usuariosResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de Usuarios', retorno: usuariosResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar os usuarios cadastrados'})
    })
  }
  
/**
 * Aqui lista dados de um usuario específico
 */
  async usuario (request, response) {
    await Usuarios.findOne({_id: request.params.id})
    .then(function (usuarioResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados do usuario', retorno: usuarioResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados do usuario com id informado'})
    })
  }
  
/**
 * Aqui é excluído o usuario especificado
 */
  async excluir (request, response) {
    const usuarioExcluido = await Usuarios.deleteOne({_id: request.params.id})
    
    if (usuarioExcluido.deletedCount > 0) {
      return response.status(200).json({codigo: 4, mensagem: 'Usuario excluído!'})
    }

    return response.status(400).json({codigo: 110, mensagem: 'Erro ao tentar excluir o usuario'})   
  }  

/**
 * Aqui é atualizado um usuario especifico
 */
  async atualizar (request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Usuarios.updateOne({_id: request.params.id}, request.body)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Usuario atualizado'})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar usuario'})
    })
  }


/**
 * Aqui é criado um usuario
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
      nome:       Yup.string().required().min(2),
      login:      Yup.string().required().min(4),
      email:      Yup.string().required().email(),
      senha:      Yup.string().required().min(3),
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    // Se o login já foi usado
    const loginExiste = await Usuarios.findOne({login: request.body.login})
    if (loginExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Este login já esta em uso! Informe outro'})
    }
    // Se o e-mail já foi usado
    const emailExiste = await Usuarios.findOne({email: request.body.email})
    if (emailExiste) {
      return response.status(400).json({codigo: 104, mensagem: 'Este e-mail já esta em uso! Informe outro'})
    }

    // Criptografando senha de usuário novo
    await bcrypt.hash(request.body.senha, 8).then(function(hash) {
      request.body.senha = hash
    });

    await Usuarios.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar usuario'})
      }
    })

    return response.status(200).json({codigo: 6, mensagem: 'Usuario criado!'})
  }

}

export default new UsuarioController()