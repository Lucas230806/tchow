const User = require('../models/User')

//criptografar a senha
const bcrypt = require('bcryptjs')

module.exports = class AuthController{
  static login(request, response){
    return response.render('auth/login')
  }

static async loginPost(request, response){
  const {email, password} = request.body

  //1º math User
  const user = await User.findOne({where:{email:email}})
  if(!user){
    request.flash('message', 'usuario não encontrado')
    response.redirect('auth/login')
    return
  }

// 2 validar senha do usuario
const passwordMath = bcrypt.compareSync(password, user.password)
if(!passwordMath){
  request.flash('message', 'senha invalida')
  response.redirect('auth/login')
  return

}
request.session.userId = user.id;

request.flash('message', 'bem vindo')

request.session.save(()=>{

  response.redirect('/')
})

}


  static register(request, response){
    return response.render('auth/register')
  }

  static async registerPost(request, response){
    const {name, email, password, confirmpassword} = request.body

// 1 validação de senha - password math
if(password != confirmpassword){
request.flash('message', ' as senha não conferem, tente novamente')
Response.render('auth/register')
return
}

//2 vqlidação de email - 
const checkedIfExists = await User.findOne({where:{email:email}})
if(checkedIfExists){
  request.flash('message', 'o e-mail ja esta em uso')
Response.render('auth/register')
  return
}

//3 validação criptografia do password 
// salt = quantidade de caracteres extras na cript
const salt = bcrypt.genSaltSync(10)
const hashedPassword = bcrypt.hashSync(password, salt)

//4 criar usuario no banco
const User = {
  name,
  email,
  password:hashedPassword
}

//5  regra de negocio do app

try {
  const createUser = await User.create(user)

  request.session.userId = createUser.id

  request.flash('message', 'cadastro realizado comn sucesso!')

  request.session.save(()=>{
  response.redirect('/')
})
  //return

} catch (error) {
  console.log(error)
}

  }
  static async logout(request, response){
    request.session.destroy()
    return response.redirect('/login')
    }
}

