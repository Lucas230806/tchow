const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController{
  static async showToughts(request, response){
    return response.render('toughts/home')//Mostrando um view
  }
}

