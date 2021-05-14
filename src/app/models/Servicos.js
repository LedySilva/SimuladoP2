import mongoose from 'mongoose';

/**
 * Aqui se cadatram os serviços que podem ser utilizados no atendimento: consulta, ecografia, 
 * radiografia, exame laboratoria, medicação etc
 */
const Servicos = new mongoose.Schema(
  {
    nome: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('servicos', Servicos);