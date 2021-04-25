import mongoose from 'mongoose';

const Servicos = new mongoose.Schema(
  {
    nome: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('servicos', Servicos);