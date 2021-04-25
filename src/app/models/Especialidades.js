import mongoose from 'mongoose';

const Especialidades = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    servicos: []
  },
  {
    timestamps: true
  }
)

export default mongoose.model('especialidades', Especialidades);