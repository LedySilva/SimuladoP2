import * as Yup from 'yup'
import Agendas from "../models/Agendas.js"

class AgendasController {

    /**
     * Aqui são listados os agendamentos
     */
    async listar(request, response) {
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
            tipo: Yup.string().required(),
            inicio: Yup.date().required(),
            termino: Yup.date().required()
        })

        // Validar se os campos estão preenchidos e de acordo
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        await Agendas.find({
            data: { $gte: request.body.inicio, $lt:  request.body.termino },
            tipo: request.body.tipo
        })
            .then(function (agendasResponse) {
                return response.status(200).json({ codigo: 3, mensagem: 'Dados da agenda no período', retorno: agendasResponse })
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 103, mensagem: 'Erro ao mostrar dados de agendamento no período informado' })
            })
    }

    /**
     * Aqui é excluído um agendamentos especificado
     */
    async excluir(request, response) {
        const agendaExcluido = await Agendas.deleteOne({ _id: request.params.id })

        if (agendaExcluido.deletedCount > 0) {
            return response.status(200).json({ codigo: 4, mensagem: 'Agendamento excluído!' })
        }

        return response.status(400).json({ codigo: 110, mensagem: 'Erro ao tentar excluir agendamento' })
    }

    /**
     * Aqui é atualizado um agendamento especifico
     */
    async atualizar(request, response) {
        const id = request.body.id || request.params.id || request.query.id
        await Agendas.updateOne({ _id: request.params.id }, request.body)
            .then(function (updateResponse) {
                return response.status(200).json({ codigo: 5, mensagem: 'Agendamento atualizado' })
            })
            .catch(function (erro) {
                return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar agendamento' })
            })
    }


    /**
     * Aqui é criado um agendamento
     */
    async criar(request, response) {
        const schema = Yup.object().shape({
            data: Yup.date().required(),
            anotacao: Yup.string().required().min(3),
            tipo: Yup.string().required().min(8)
        })

        // Validar se os campos estão preenchidos e de acordo
        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
        }

        await Agendas.create(request.body, function (erro) {
            if (erro) {
                return response.status(400).json({ codigo: 103, mensagem: 'Erro no BD ao cadastrar agendamento' })
            }
        })

        return response.status(200).json({ codigo: 6, mensagem: 'Agendamento criado!' })
    }

}

export default new AgendasController()