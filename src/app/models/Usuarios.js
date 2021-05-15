import mongoose from 'mongoose';

const Usuarios = new mongoose.Schema(
   {
    nome:  {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    perfis: [],
    role: String
  },
  {
    timestamps: true
  }
)

export default mongoose.model('usuarios', Usuarios);
