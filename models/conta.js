import mongoose from 'mongoose'

const Conta = mongoose.model('Conta',{
    name: 'string',
    senha: 'string',
    saldo: 'number',
    tipo: 'string',
})

export default Conta