import mongoose from 'mongoose';

const Usuarios = new mongoose.Schema(
   {
    nome:  {type: String, required: true},
    sexo:  {type: String},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    posts: [{
      titulo: {type: String, required: true},
      conteudo: {type: String, required: true}
   }]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('usuariosPostagem', Usuarios);
