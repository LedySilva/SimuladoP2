import * as Yup from 'yup'
import Especialidades from '../models/Especialidades.js'
import Medicos from "../models/Medicos.js"

class MedicosController {

/**
 * Aqui são listados os medicos
 */
  async listar (request, response) {
    await Medicos.find({})
    .then(function (medicosResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de Médicos cadastrados!', retorno: medicosResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar os Médicos cadastrados!'})
    })
  }
  
/**
 * Aqui lista dados de um medico específico
 */
  async medicos (request, response) {
    await Medicos.findOne({_id: request.params.id})
    .then(function (medicosResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados do Médico cadastrados!', retorno: medicosResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados do Médico com id informado'})
    })
  }
  
/**
 * Aqui é excluído o medico especificado
 */
  async excluir (request, response) {
    const medicosExcluido = await Medicos.deleteOne({_id: request.params.id})
    
    if (medicosExcluido.deletedCount > 0) {
      return response.status(200).json({codigo: 4, mensagem: 'Médico excluído!'})
    }

    return response.status(400).json({codigo: 110, mensagem: 'Erro ao tentar excluir o Médico!'})   
  }  

/**
 * Aqui é atualizado um medico especifico
 */
  async atualizar (request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Medicos.updateOne({_id: request.params.id}, request.body)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Médico atualizado'})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar Médico'})
    })
  }


/**
 * Aqui é criado um medico
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
      crm: Yup.string().required(), 
      nome: Yup.string().required(),
      endereco: Yup.string().required(),
      cpf: Yup.string().required(),
      data_nascimento: Yup.date(),
      matricula: Yup.string().required()
    })
    
    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
    // Se o CRM já foi usado
    const crmExiste = await Medicos.findOne({crm: request.body.crm})
    if (crmExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Este CRM já esta em uso! Informe outro'})
    }
   
     // Se o CPF já foi usado
     const cpfExiste = await Medicos.findOne({cpf: request.body.cpf})
     if (cpfExiste) {
       return response.status(400).json({codigo: 102, mensagem: 'Este CPF já esta em uso! Informe outro'})
     }
   
      // Se a matrícula já foi usada
    const matriculaExiste = await Medicos.findOne({matricula: request.body.matricula})
    if (matriculaExiste) {
      return response.status(400).json({codigo: 102, mensagem: 'Esta matrícula já esta em uso! Informe outra'})
    }
   

    // Criando um novo Médico
    await Medicos.create(request.body)
    .then(function (retorno) {
      return response.status(200).json({ codigo: 5, mensagem: 'Médico cadastrado!', retorno: retorno })
    })
    .catch(function (erro) {
      return response.status(400).json({ codigo: 109, mensagem: 'Erro ao cadastrar novo médico', retorno: erro })
    })
/*
    await Medicos.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar Médico!'})
      }
    })

    return response.status(200).json({codigo: 6, mensagem: 'Médico criado!'})
    */
  }

  
/**
 * Aqui é vinculada uma especialidade a um médico
 */
 async vincular (request, response) {
  const schema = Yup.object().shape({
    idMedico: Yup.string().required(),
    idEspecialidade: Yup.string().required()
  })

  // Validar se os dados mínimos estão preenchidos
  if (!(await schema.isValid(request.body))) {
    return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
  }

  const medicoExiste = await Medicos.findOne({_id: request.body.idMedico})
  const especialidadeExiste = await Especialidades.findOne({_id: request.body.idEspecialidade})
  const vinculoExiste = await Medicos.findOne({_id: request.body.idMedico, 'especialidades.nome': especialidadeExiste.nome })

  if (vinculoExiste) {
    return response.status(400).json({codigo: 109, mensagem: 'Já existe este vinculo de especialidade ao médico'})
  }

  medicoExiste.especialidades.push(especialidadeExiste)

  await Medicos.updateOne({_id: request.body.idMedico}, medicoExiste)
  .then(function (updateResponse) {
    return response.status(200).json({codigo: 5, mensagem: 'Médico atualizado com nova especialidade', retorno: medicoExiste})
  })
  .catch(function (erro) {
    return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar médico com especialidade'})
  })
}

/**
* Aqui é desvinculado uma especialidade a um médico
*/
async desvincular (request, response) {
  const schema = Yup.object().shape({
    idMedico: Yup.string().required(),
    idEspecialidade: Yup.string().required()
    })

  // Validar se os dados mínimos estão preenchidos
  if (!(await schema.isValid(request.body))) {
    return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
  }

  const especialidade = await Especialidades.findOne({_id: request.body.idEspecialidade})

  await Medicos.updateOne( {_id: request.body.idMedico}, { $pull: {especialidades: {nome: especialidade.nome } } } )

  return response.status(200).json({codigo: 0, mensagem: 'Serviço desvinculado!'})
}


}

export default new MedicosController()