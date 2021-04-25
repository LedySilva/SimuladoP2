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
      inicio: Yup.date().default(function () { return new Date() }),
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

    await Convenios.create(request.body, function (erro) {
      if (erro) {
        return response.status(400).json({ codigo: 103, mensagem: 'Erro no BD ao cadastrar convênio' })
      }
    })

    return response.status(200).json({ codigo: 6, mensagem: 'Comvênio criado!' })
  }


  /**
   * Aqui verifica se convenio está vigente (data de início menor que hoje e data de termino nula ou maior que hoje)
   */
  async vigencia(request, response) {
    const id = request.body.id || request.params.id || request.query.id
    await Convenios.findOne({ _id: request.params.id }, request.body)
      // query db.Collection.find({
      // created_at : {
      // '$gte': new Timestamp(new Date(2012, 0, 21), 0),
      // '$lte': new Timestamp(new Date(2012, 0, 22), 0)
      // })

      .then(function (vigenciaResponse) {
        // const vigenciaResponse = existe então true
        return response.status(200).json({ codigo: 5, mensagem: 'Convênio atualizado', retorno: vigenciaResponse })
      })
      .catch(function (erro) {
        return response.status(400).json({ codigo: 109, mensagem: 'Erro ao verificar vigência de convênio' })
      })
  }





}

export default new ConveniosController()