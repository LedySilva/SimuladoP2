const mongoose = require('mongoose')

class DataBase {
  constructor () {
    this.mongoDatBase()
  }

  mongoDatBase () {
    const uri = 'mongodb+srv://dbUser:hTkcmi2BbteQBAu6@sgah.vyqxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    
    mongoose.connect(uri, {useNewUrlParse: true, useNewFieldTopology: true})
    .then(function () {
      console.log('Conectado ao MongoDB!')
    })
    .catch(function (e) {
      console.log('Erro na conexão ao MongoDB: ' + e)
    })
  }
}

module.exports = new DataBase()
