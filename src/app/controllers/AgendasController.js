import * as Yup from 'yup'
import Agendas from "../models/Agendas.js"
import Pacientes from "../models/Pacientes.js"
import Convenios from "../models/Convenios.js"
import Medicos from "../models/Medicos.js"
import Usuarios from "../models/Usuarios.js"

class AgendasController {

    /**
     * Aqui são listados os agendamentos
     */
    async listar(request, response) {
        // listar por periodo, por medico ou por paciente
        await Agendas.find({})
            .then(function (agendasResponse) {
                return response.status(200).json({ codigo: 2, mensagem: 'Lista de Agendamentos', retorno: agendasResponse })
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 105, mensagem: 'Erro ao listar os agendamentos cadastrados' })
            })
    }

    /**
     * Aqui lista dados de um agendamento específico
     */
    async agenda(request, response) {
        // Deve acrescentar todos os relacionamentos dos ids de paciente, medico e observações
        await Agendas.findOne({ _id: request.params.id })
            .then(function (agendasResponse) {
                return response.status(200).json({ codigo: 3, mensagem: 'Dados da agenda', retorno: agendasResponse })
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 103, mensagem: 'Erro ao mostrar dados de agendamento com id informado' })
            })
    }

    /**
     * Aqui lista dados dos agendamentos em um período
     */
    async listarPeriodo(request, response) {
        const schema = Yup.object().shape({
            inicio: Yup.date().required(),
            termino: Yup.date().required()
        })

        // Validar se os campos estão preenchidos e de acordo
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        // Query base: é obrigatório pelo menos o período de início e término
        const query = {
            inicio: { $gte: request.body.inicio },
            termino: { $lte: request.body.termino }
        }

        // Opcional: se for enviado paciente inclui ele no filrto e só traz agendas com este paciente
        if (request.body.paciente) {
            query.paciente = request.body.paciente
        }

        // Opcional: se for enviado medico inclui ele no filrto e só traz agendas com este médico
        if (request.body.medico) {
            query.medico = request.body.medico
        }

        // Opcional: se for enviado convenio inclui ele no filrto e só traz agendas com este convênio
        if (request.body.convenio) {
            query.convenio = request.body.convenio
        }

        await Agendas.find(query)
        .then(function (retorno) {
            return response.status(200).json({ codigo: 3, mensagem: 'Dados da agenda no período', retorno: retorno })
        })
        .catch(function (erro) {
            return response.status(400).json({ codigo: 103, mensagem: 'Erro ao mostrar dados de agendamento no período informado', retorno: erro })
        })
    }

    /**
     * Aqui é excluído um agendamentos especificado
     */
    async cancelar(request, response) {
        const agendaExcluido = await Agendas.deleteOne({ _id: request.params.id })

        if (agendaExcluido.deletedCount > 0) {
            return response.status(200).json({ codigo: 4, mensagem: 'Agendamento excluído!', retorno: agendaExcluido })
        }

        return response.status(400).json({ codigo: 110, mensagem: 'Erro ao tentar excluir agendamento' })
    }

    /**
     * Aqui é atualizado um agendamento especifico
     */
    async atualizar(request, response) {
        await Agendas.updateOne({ _id: request.params.id }, request.body)
            .then(function (retorno) {
                return response.status(200).json({ codigo: 5, mensagem: 'Agendamento atualizado'})
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar agendamento', retorno: erro })
            })
    }


    /**
     * Aqui é criado um agendamento
     */
    async agendar(request, response) {
        const schema = Yup.object().shape({
            inicio: Yup.date().required(),
            termino: Yup.date().required(),
            paciente: Yup.string().matches(/^[a-f\d]{24}$/i),
            convenio: Yup.string().matches(/^[a-f\d]{24}$/i),
            medico: Yup.string().matches(/^[a-f\d]{24}$/i),
            anotacao: Yup.object({
                texto: Yup.string().required().min(5),
                usuario: Yup.string().matches(/^[a-f\d]{24}$/i)
            })
        })

        // Validar se os campos estão preenchidos e de acordo
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        // Validar se os IDs informado existem já cadastrados
        const pacienteExiste = await Pacientes.findOne({_id: request.body.paciente})
        if (!pacienteExiste) {
            return response.status(400).json({codigo: 102, mensagem: 'Este paciente não esta cadastrado!'})
        }
        
        const convenioExiste = await Convenios.findOne({_id: request.body.convenio})
        if (!convenioExiste) {
            return response.status(400).json({codigo: 103, mensagem: 'Este convênio não esta cadastrado!'})
        }
        
        const medicoExiste = await Medicos.findOne({_id: request.body.medico})
        if (!medicoExiste) {
            return response.status(400).json({codigo: 104, mensagem: 'Este médico não esta cadastrado!'})
        }
        
        const usuarioExiste = await Usuarios.findOne({_id: request.body.anotacao.usuario})
        if (!usuarioExiste) {
            return response.status(400).json({codigo: 104, mensagem: 'Este usuário do registro não esta cadastrado!'})
        }

        // TODO verificr se não há choque de agenda do Médico

        await Agendas.create(request.body)
        .then(function (retorno) {
          return response.status(200).json({ codigo: 5, mensagem: 'Agendamento criado!', retorno: retorno })
        })
        .catch(function (erro) {
          return response.status(400).json({ codigo: 109, mensagem: 'Erro ao criar agendamento', retorno: erro})
        })

    }

}

export default new AgendasController()