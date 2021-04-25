import mongoose from 'mongoose';

const Pacientes = new mongoose.Schema(
   {
      cpf:              {type: String, required: true},
      nome:             {type: String, required: true},
      data_nascimento:  {type: Date, required: true},
      endereco:         {type: String, required: true},
      convenios: [],
      prontuario: []
  },
  {
    timestamps: true
  }
)

export default mongoose.model('pacientes', Pacientes);