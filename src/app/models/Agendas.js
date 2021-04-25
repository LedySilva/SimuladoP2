import mongoose from 'mongoose';

const Agendas = new mongoose.Schema(
   {
      data:     {type: Date, required: true},
      anotacao: {type: String, required: true},
      tipo:     {type: String, required: true} // tipo: 'consultas', 'pessoal'
  },
  {
    timestamps: true
  }
)

export default mongoose.model('agendas', Agendas);