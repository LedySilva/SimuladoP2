import * as Yup from 'yup'
import Pacientes from '../models/Pacientes.js'
import Convenios from "../models/Convenios.js"


class PacientesController {

/**
 * Aqui são listados os pacientes
 */
  async listar (request, response) {
    await Pacientes.find({})
    .then(function (pacientesResponse) {
      return response.status(200).json({codigo: 2, mensagem: 'Lista de Pacientes cadastrados!', retorno: pacientesResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 105, mensagem: 'Erro ao listar os Pacientes cadastrados!'})
    })
  }
  
/**
 * Aqui lista dados de um paciente específico
 */
  async paciente (request, response) {
    await Pacientes.findOne({_id: request.params.id})
    .then(function (pacientesResponse) {
      return response.status(200).json({codigo: 3, mensagem: 'Dados do Paciente cadastrados!', retorno: pacientesResponse})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 103, mensagem: 'Erro ao mostrar dados do Paciente com id informado'})
    })
  }
  
/**
 * Aqui é excluído o paciente especificado
 */
  async excluir (request, response) {
    const pacientesExcluido = await Pacientes.deleteOne({_id: request.params.id})
    
    if (pacientesExcluido.deletedCount > 0) {
      return response.status(200).json({codigo: 4, mensagem: 'Paciente excluído!'})
    }

    return response.status(400).json({codigo: 110, mensagem: 'Erro ao tentar excluir o Paciente!'})   
  }  

/**
 * Aqui é atualizado um paciente especifico
 */
  async atualizar (request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Pacientes.updateOne({_id: request.params.id}, request.body)
    .then(function (updateResponse) {
      return response.status(200).json({codigo: 5, mensagem: 'Paciente atualizado'})
    })
    .catch(function (erro) {
      return response.status(400).json({codigo: 109, mensagem: 'Erro ao atualizar Paciente'})
    })
  }


/**
 * Aqui é criado um paciente
 */
  async criar (request, response) {
    const schema = Yup.object().shape({
        cpf:              {type: String, required: true},
        nome:             {type: String, required: true},
        data_nascimento:  {type: Date, required: true},
        endereco:         {type: String, required: true}
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({codigo: 101, mensagem: 'Informações incorretas'})
    }
     // Se o CPF já foi usado
     const cpfExiste = await Pacientes.findOne({cpf: request.body.cpf})
     if (cpfExiste) {
       return response.status(400).json({codigo: 102, mensagem: 'Este CPF já esta em uso! Informe outro'})
     }
   
    // Criando um novo Paciente
    await Pacientes.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({codigo: 103, mensagem: 'Erro no BD ao cadastrar Paciente!'})
      }
    })

    return response.status(200).json({codigo: 6, mensagem: 'Paciente criado!'})
  }


    /**
     * Aqui é vinculada um convenio a um Paciente
     */
    async vincular(request, response) {
        const schema = Yup.object().shape({
            idPaciente: Yup.string().required(),
            idConvenio: Yup.string().required()
        })

        // Validar se os dados mínimos estão preenchidos
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        const pacienteExiste = await Pacientes.findOne({ _id: request.body.idPaciente })
        const convenioExiste = await Convenios.findOne({ _id: request.body.idConvenio })
        const vinculoExiste = await Pacientes.findOne({ _id: request.body.idPaciente, 'convenios.nome': convenioExiste.nome })

        if (vinculoExiste) {
            return response.status(400).json({ codigo: 109, mensagem: 'Já existe este vinculo de convenio ao Paciente' })
        }

        pacienteExiste.convenios.push(convenioExiste)

        await Pacientes.updateOne({ _id: request.body.idPaciente }, pacienteExiste)
            .then(function (updateResponse) {
                return response.status(200).json({ codigo: 5, mensagem: 'Paciente atualizado com novo convenio', retorno: pacienteExiste })
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar Paciente com convenio' })
            })
    }

    /**
    * Aqui é desvinculado uma convenio a um Paciente
    */
    async desvincular(request, response) {
        const schema = Yup.object().shape({
            idPaciente: Yup.string().required(),
            idConvenio: Yup.string().required()
        })

        // Validar se os dados mínimos estão preenchidos
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        const convenio = await Convenios.findOne({ _id: request.body.idConvenio })

        await Pacientes.updateOne({ _id: request.body.idPaciente }, { $pull: { convenios: { nome: convenio.nome } } })

        return response.status(200).json({ codigo: 0, mensagem: 'Convenio desvinculado!' })
    }


}

export default new PacientesController()