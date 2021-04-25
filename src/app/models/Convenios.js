import mongoose from 'mongoose';

const Convenios = new mongoose.Schema(
    {
        nome:    { type: String, required: true },
        inicio:  { type: Date, required: true },
        termino: { type: Date } // Quando não há data de término é considerado ativo o convênio. Se houer término, então ele está será inativo posterior a esta data
    },
    {
        timestamps: true
    }
)

export default mongoose.model('convenios', Convenios);