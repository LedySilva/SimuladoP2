import mongoose from 'mongoose'

const uri = 'mongodb+srv://dbUser:hTkcmi2BbteQBAu6@sgah.vyqxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

class Connection {
  constructor () {
    this.conexaoMongoDB()
  }

  conexaoMongoDB () {
    mongoose.connect(uri, {
      useNewUrlParse: true, 
      useNewFieldTopology: true
    })
    .then(function () {
      console.log('Conectado ao MongoDB!')
    })
    .catch(function (erro) {
      console.log('Erro na conexão ao MongoDB: ' + erro)
    })
  }
  
}

export default new Connection()