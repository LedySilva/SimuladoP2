import * as Yup from 'yup'
import Servicos from "../models/Servicos.js"

class ServicosController {

/**
 * Aqui são listados os serviços
 */
  async listar (request, response) {
    await Servicos.find({})
    .then(function (servicosResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de Serviços', retorno: servicosResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar os serviços cadastrados'})
    })
  }
  
/**
 * Aqui lista dados de um serviço específico
 */
  async servico (request, response) {
    await Servicos.findOne({_id: request.params.id})
    .then(function (servicosResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados do serviço', retorno: servicosResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados do serviço com id informado'})
    })
  }
  
/**
 * Aqui é excluído o serviço especificado
 */
  async excluir (request, response) {
    const servicoExcluido = await Servicos.deleteOne({_id: request.params.id})
    
    if (servicoExcluido.deletedCount > 0) {
      return response.status(200).json({codigo: 4, mensagem: 'Serviço excluído!'})
    }

    return response.status(400).json({codigo: 110, mensagem: 'Erro ao tentar excluir o serviço'})   
  }  

/**
 * Aqui é atualizado um serviço especifico
 */
  async atualizar (request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Servicos.updateOne({_id: request.params.id}, request.body)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Serviço atualizado'})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar serviço'})
    })
  }


/**
 * Aqui é criado um serviço
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
      nome: Yup.string().required().min(3)
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    
    // Se o serviço já foi usado
    const servicoExiste = await Servicos.findOne({login: request.body.nome})
    if (servicoExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Este serviço já esta em uso! Informe outro'})
    }

    await Servicos.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar serviço'})
      }
    })

    return response.status(200).json({codigo: 6, mensagem: 'Serviço criado!'})
  }

}

export default new ServicosController()