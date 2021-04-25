import * as Yup from 'yup'
import * as bcrypt from 'bcryptjs'
import Usuarios from "../models/Usuarios.js"

class AcessoController {

/**
 * Realizar login no sistema
 */
  async login (request, response) {
    const schema = Yup.object().shape({
      login:      Yup.string(),
      email:      Yup.string().email(),
      senha:      Yup.string().required(),
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    
    const usuario = await Usuarios.findOne({$or: [{email: request.body.email}, {login: request.body.login}] })

    if (!usuario) {
      return response.status(401).json({codigo: 120, mensagem: 'Login nem E-mail localizados!'})
    }

    // Se o login ou e-mail existe deve comparar senha enviada e a armazenada no cadastro do usuario
    if (!(await bcrypt.compare(request.body.senha, usuario.senha))) {
      return response.status(401).json({codigo: 121, mensagem: 'Senha inválida!'})
    }

    return response.status(200).json({codigo: 4, mensagem: 'Login efetuado', retorno: usuario})
  }

/**
 * Sair do sistema (logout))
 */
  async logout (request, response) {
  }


}

export default new AcessoController()