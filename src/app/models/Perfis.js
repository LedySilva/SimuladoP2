const mongoose = require('mongoose')

const Perfis
 = new mongoose.Schema(
   {
    nome: {type: String, required: true}
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('perfis', Perfis)