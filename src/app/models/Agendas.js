import mongoose from 'mongoose';

const Agendas = new mongoose.Schema(
   {
     inicio:      {type: Date, required: true},
     termino:     {type: Date, required: true},
     paciente:    { type: mongoose.Schema.Types.ObjectId, ref: 'Pacientes' },
     convenio:    { type: mongoose.Schema.Types.ObjectId, ref: 'Convenios' },
     medico:      { type: mongoose.Schema.Types.ObjectId, ref: 'Medicos' },
     anotacao:    [{ texto: String, usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' } }]
     // Local -> Consultório
  },
  {
    timestamps: true
  }
)

export default mongoose.model('agendas', Agendas);