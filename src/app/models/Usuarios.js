const mongoose = require('mongoose')

const Usuarios
 = new mongoose.Schema(
   {
    nome:  {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    perfis: []
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('usuarios', Usuarios)