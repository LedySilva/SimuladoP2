import * as Yup from 'yup'
import * as bcrypt from 'bcryptjs'
import Usuarios from "../models/Usuarios.js"

class UsuarioController {


  /********************************************************************
   * Aqui ficam as funções relativas a autenticacao e validacao de usuário
   * /login
   ********************************************************************/

  /**
   * Realizar login
   */
  async login(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      senha: Yup.string().required(),
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
    }

    const usuario = await Usuarios.findOne({ email: request.body.email })

    if (!usuario) {
      return response.status(401).json({ codigo: 120, mensagem: 'E-mail localizado!' })
    }

    // Se o e-mail existe deve comparar senha enviada e a armazenada no cadastro do usuario
    if (!(await bcrypt.compare(request.body.senha, usuario.senha))) {
      return response.status(401).json({ codigo: 121, mensagem: 'Senha inválida!' })
    }

// TODO implementar JWT com secret e arquivo de config return com token . Usar o id no token

    return response.status(200).json({ codigo: 4, mensagem: 'Login efetuado', retorno: usuario })
  }


  /**
   * Cria novo usuario
   */
   async criaUsuario(request, response) {
    const schema = Yup.object().shape({
      nome:  Yup.string().required(),
      sexo:  Yup.string(),
      email: Yup.string().required(),
      senha: Yup.string().required()
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
    }

    const usuario = await Usuarios.findOne({ email: request.body.email })

    if (usuario) {
      return response.status(401).json({ codigo: 120, mensagem: 'E-mail já existe!' })
    }

    await usuario.create(request.body)
    .then(function (retorno) {
      return response.status(200).json({ codigo: 5, mensagem: 'Usuario criado!', retorno: retorno })
    })
    .catch(function (erro) {
      return response.status(400).json({ codigo: 109, mensagem: 'Erro ao criar usuario', retorno: erro})
    })
    
  }


  /**
  * Sair (logout)
  */
  async logout(request, response) {
  }



  /********************************************************************
   * Aqui ficam as funções relativas ao usuário autenticado
   * /profile/
   ********************************************************************/

  /**
   * Lista dados de usuario autenticado
   */
  async dadosUsuario(request, response) {
    await Usuarios.findOne({ email: request.params.email })
      .then(function (usuarioResponse) {
        return response.status(200).json({ codigo: 3, mensagem: 'Dados do usuario', retorno: usuarioResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 103, mensagem: 'Erro ao mostrar dados do usuario com e-mail informado' })
      })
  }


  /**
   * Atualizado usuario autenticado
   */
  async atualizaUsuario(request, response) {
    await Usuarios.updateOne({ email: request.params.email }, request.body)
      .then(function (updateResponse) {
        return response.status(200).json({ codigo: 5, mensagem: 'Usuario atualizado' })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar usuario' })
      })
  }


  /**
   * Exclui o usuario autenticado
   */
  async excluiUsuario(request, response) {
    const usuarioExcluido = await Usuarios.deleteOne({ email: request.params.email })

    if (usuarioExcluido.deletedCount > 0) {
      return response.status(200).json({ codigo: 4, mensagem: 'Usuario excluído!' })
    }

    return response.status(400).json({ codigo: 110, mensagem: 'Erro ao tentar excluir o usuario' })
  }




  /********************************************************************
   * Aqui ficam as funções relativas aos posts do usuario
   * /profile/posts
   ********************************************************************/

  /**
   * Lista todos os post do usuario autenticado
   */
  async listaTodosPostUsuario(request, response) {

    const usuario = await Usuarios.findOne({ email: request.body.email })

    return response.status(200).json({ codigo: 5, mensagem: 'Posts do Usuario', retorno: usuario.posts })
  }


  /**
   * Lista um post específico do usuario autenticado
   */
  async listaPostUsuario(request, response) {

    const usuario = await Usuarios.findOne({ email: request.body.email })

    return response.status(200).json({ codigo: 5, mensagem: 'Posts do Usuario', retorno: usuario.posts })
  }


  /**
   * Editar um post específico do usuario autenticado
   */
  async editaPostUsuario(request, response) {

    const usuario = await Usuarios.findOne({ email: request.body.email })

    return response.status(200).json({ codigo: 5, mensagem: 'Posts do Usuario', retorno: usuario.posts })
  }


  /**
   * Adiciona um post do usuario autenticado
   */
  async adicionaPostUsuario(request, response) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      conteudo: Yup.string().required()
    })

    // Validar se os dados mínimos estão preenchidos
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ codigo: 101, mensagem: 'Informações incompletas' })
    }

    // TODO trocar por função de valiação de token
    const usuarioExiste = await Usuarios.findOne({ email: request.body.email })
    if (usuarioExiste) {
      return response.status(400).json({ codigo: 109, mensagem: 'Usuario não existe' })
    }

    usuarioExiste.perfis.push()

    await Usuarios.updateOne({ _id: request.body.idUsuario }, usuarioExiste)
      .then(function (updateResponse) {
        return response.status(200).json({ codigo: 5, mensagem: 'Usuario atualizado com novo perfil', retorno: usuarioExiste })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar usuario com perfil' })
      })
  }


  /**
   * Exclui post específico do usuario autenticado
   */
  async excluiPostUsuario(request, response) {

    const usuario = await Usuarios.findOne({ email: request.body.email })

    return response.status(200).json({ codigo: 5, mensagem: 'Posts do Usuario', retorno: usuario.posts })
  }






  /********************************************************************
   * Aqui ficam as funções publicas relativas a usuários
   * /users/
   ********************************************************************/

  /**
   * Lista todos os usuarios
   */
  async listaTodosUsuario(request, response) {
    await Usuarios.find({})
      .then(function (usuariosResponse) {
        return response.status(200).json({ codigo: 2, mensagem: 'Lista de Usuarios', retorno: usuariosResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 105, mensagem: 'Erro ao listar os usuarios cadastrados' })
      })
  }


  
  /**
   * Lista dados de um usuario especifico
   */
  async listaUsuarioEspecifico(request, response) {
    await Usuarios.findOne({ _id: request.params.id })
      .then(function (usuariosResponse) {
        return response.status(200).json({ codigo: 2, mensagem: 'Dados de Usuarios', retorno: usuariosResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 105, mensagem: 'Erro ao listar usuario cadastrado' })
      })
  }



  /**
   * Lista posts de usuario específico
   */
  async listaPostsUsuarioEspecifico(request, response) {
    await Usuarios.findOne({ _id: request.params.id })
      .then(function (usuariosResponse) {
        return response.status(200).json({ codigo: 2, mensagem: 'Posts de Usuarios', retorno: usuariosResponse.posts })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 105, mensagem: 'Erro ao listar todos os posts de usuario' })
      })
  }



  /**
   * Lista post específico de um usuario específico
   */
  async postUsuarioEspecifico(request, response) {
    await Usuarios.findOne({ _id: request.params.id })
      .then(function (usuariosResponse) {
        // não sei como fazer ainda
        return response.status(200).json({ codigo: 2, mensagem: 'Post especifico de Usuario', retorno: usuariosResponse.posts })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 105, mensagem: 'Erro ao pegar post de usuario' })
      })
  }




}

export default new UsuarioController()