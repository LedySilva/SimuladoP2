import mongoose from 'mongoose';

const Perfis = new mongoose.Schema(
   {
    nome: {type: String, required: true}
  },
  {
    timestamps: true
  }
)

export default mongoose.model('perfis', Perfis);