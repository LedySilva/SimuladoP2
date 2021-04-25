import * as Yup from 'yup'
import Especialidades from "../models/Especialidades.js"
import Servicos from "../models/Servicos.js"

class EspecialidadesController {

/**
 * Aqui são listadas as especialidades
 */
  async listar (request, response) {
    await Especialidades.find({})
    .then(function (especialidadesResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de especialidades', retorno: especialidadesResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar as especialidades cadastradas'})
    })
  }
  
/**
 * Aqui lista dados de uma especialidades específica
 */
  async especialidade (request, response) {
    await Especialidades.findOne({_id: request.params.id})
    .then(function (especialidadesResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados da especialidade', retorno: especialidadesResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados da especialidade com id informado'})
    })
  }
  
/**
 * Aqui é excluído o especialidades especificado
 */
  async excluir (request, response) {
    const especialidadeExcluido = await Especialidades.deleteOne({_id: request.params.id})
    
    if (especialidadeExcluido.deletedCount > 0) {
      return response.status(200).json({codigo: 4, mensagem: 'Especialidades excluída!'})
    }

    return response.status(400).json({codigo: 110, mensagem: 'Erro ao tentar excluir a especialidade'})   
  }  


/**
 * Aqui é atualizada uma especialidades especifica
 */
  async atualizar (request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Especialidades.updateOne({_id: request.params.id}, request.body)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Especialidade atualizada'})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar especialidade'})
    })
  }


/**
 * Aqui é criado uma especialidade
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
      nome: Yup.string().required().min(3)
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    
    // Se a especialidade já foi usada
    const especialidadeExiste = await Especialidades.findOne({login: request.body.nome})
    if (especialidadeExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Esta especialidade já esta em uso! Informe outra'})
    }

    await Especialidades.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar especialidade'})
      }
    })

    return response.status(200).json({codigo: 6, mensagem: 'Especialidade criada!'})
  }

  
/**
 * Aqui é vinculada um servico a uma especialidade
 */
 async vincular (request, response) {
    const schema = Yup.object().shape({
      idServico: Yup.string().required(),
      idEspecialidade: Yup.string().required()
    })

    // Validar se os dados mínimos estão preenchidos
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }

    const servicoExiste = await Servicos.findOne({_id: request.body.idServico})
    const especialidadeExiste = await Especialidades.findOne({_id: request.body.idEspecialidade})
    const vinculoExiste = await Especialidades.findOne({_id: request.body.idEspecialidade, 'servicos.nome': servicoExiste.nome })

    if (vinculoExiste) {
      return response.status(400).json({codigo: 109, mensagem: 'Já existe este vinculo de serviço e especialidade'})
    }

    especialidadeExiste.perfis.push(servicoExiste)

    await Especialidades.updateOne({_id: request.body.idEspecialidade}, especialidadeExiste)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Especialidade atualizada com novo serviço', retorno: especialidadeExiste})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar especialidade com serviço'})
    })
  }

/**
 * Aqui é desvinculado um servico de uma especialidade
 */
  async desvincular (request, response) {
    const schema = Yup.object().shape({
        idServico: Yup.string().required(),
        idEspecialidade: Yup.string().required()
      })

    // Validar se os dados mínimos estão preenchidos
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }

    const servico = await Perfis.findOne({_id: request.body.idServico})

    await Especialidades.updateOne( {_id: request.body.idEspecialidade}, { $pull: {servicos: {nome: servico.nome } } } )

    return response.status(200).json({codigo: 0, mensagem: 'Serviço desvinculado!'})
  }


}

export default new EspecialidadesController()