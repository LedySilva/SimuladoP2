import * as Yup from 'yup'
import Convenios from '../models/Convenios.js'

class ConveniosController {

  /**
   * Aqui são listados os Convenios
   */
  async listar(request, response) {
    await Convenios.find({})
      .then(function (conveniosResponse) {
        return response.status(200).json({ codigo: 2, mensagem: 'Lista de Convênios!', retorno: conveniosResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 105, mensagem: 'Erro ao listar os convênios cadastrados!' })
      })
  }


  /**
   * Aqui lista dados de um convenio específico
   */
  async convenio(request, response) {
    await Convenios.findOne({ _id: request.params.id })
      .then(function (conveniosResponse) {
        return response.status(200).json({ codigo: 3, mensagem: 'Dados do convênio!', retorno: conveniosResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 103, mensagem: 'Erro ao mostrar dados do convênio!' })
      })
  }


  /**
   * Aqui é atualizado um convênio especifico
   */
  async atualizar(request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Convenios.updateOne({ _id: request.params.id }, request.body)
      .then(function (updateResponse) {
        return response.status(200).json({ codigo: 5, mensagem: 'Convênio atualizado' })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 109, mensagem: 'Erro ao atualizar convênio' })
      })
  }


  /**
   * Aqui são gravados os dados do Convenio
   */
  async criar(request, response) {
    const schema = Yup.object().shape({
      nome: Yup.string().required().min(5),
      inicio: Yup.date(),
      termino: Yup.date()
    })

    // Validar se os campos estão preenchidos e de acordo
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ codigo: 101, mensagem: 'Informações incorretas' })
    }

    // Se o convênio já existe
    const convenioExiste = await Convenios.findOne({ login: request.body.nome })
    if (convenioExiste) {
      return response.status(400).json({ codigo: 102, mensagem: 'Este convênio já esta em uso! Informe outro' })
    }

    await Convenios.create(request.body)
      .then(function (retorno) {
        return response.status(200).json({ codigo: 5, mensagem: 'Convênio criado!', retorno: retorno })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 109, mensagem: 'Erro ao criar convênio', retorno: erro})
      })
  }



}

export default new ConveniosController()