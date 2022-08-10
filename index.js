import inquirer from 'inquirer'
import chalk from 'chalk'

import mongoose from 'mongoose'


const Conta = mongoose.model('Conta',{
    name: 'string',
    senha: 'string',
    saldo: 'number',
    tipo: 'string',
})

mongoose.connect(
    'mongodb+srv://thiagoocms:Melancia1@cluster0.g1qpdy5.mongodb.net/?retryWrites=true&w=majority'
    )
     .then(()=> {
        entrada()
     })
     .catch((err)=> console.log(err))
 

console.log('ok')

function entrada(){
    inquirer.prompt([
        {
            type: 'list',
            name:'op',
            message:'Seja bem-vindo(a) ao nosso banco !',
            choices:[
                'Acessar conta',
                'Criar conta'
            ]
        }
    ])
       .then((answer)=> {

        const op = answer['op']
        if(op === 'Acessar conta'){
            login()
        }else if(op === 'Criar conta'){
            criarConta()
        }
       })
       .catch((err)=> {console.log(err)})
}
function login(){
    inquirer.prompt([
        {
            name:'nomeConta',
            message:'Qual nome da sua conta?'
        },
        {
            name:'senhaConta',
            message:'Qual a sua senha?'
        }
    ])
      .then((answer)=>{
        const nomeConta = answer['nomeConta']
        const senhaConta = answer['senhaConta']
         test(nomeConta,senhaConta)
       
       


      })
     .catch((err)=>{console.log(err)})
}
async function test(nomeConta,senhaConta){
    const conta = await Conta.findOne({name:nomeConta})
    
    if(conta){
        menu(nomeConta, senhaConta)
    }else{
        console.log(chalk.bgRedBright.blackBright('conta não encontrada.'))
        opcao()
    }
    
}


function menu(nomeConta,senhaConta){

    inquirer.prompt([
        {
            type: 'list',
            name:'acao',
            message:'O que deseja fazer?',
            choices:[
                
                'Consultar',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ])
      .then((answer) => {
        const acao = answer['acao']

         if(acao ==='Sair'){
            console.log(chalk.bgBlueBright.blackBright('Obrigado por usar nosso banco, ate a proxima'))
            process.exit()
        }else if(acao === 'Depositar'){
            deposito(nomeConta,senhaConta)
        }else if(acao === 'Consultar'){
            consultaSaldo(nomeConta, senhaConta)
        }else if(acao ==='Sacar'){
            sacar(nomeConta,senhaConta)
        }
      })
      .catch((err) => console.log(err))
        
}
function opcao(){
    inquirer.prompt([
    {
        type:'list',
        name: 'opcao',
        message:'O senhor(a) quer criar uma conta? ',
        choices:[
            'Sim',
            'Não'
        ]
    }
    ])
      .then((answer)=>{
        const opcao = answer['opcao']

        if(opcao === 'Sim'){
            criarConta()
        }else{
            console.log(chalk.blueBright('Muito obrigado por acessar nosso banco!'))
            process.exit()
        }
      })
      .catch((err)=>{console.log(err)})
}

function criarConta(){
    console.log(chalk.bgGreen.black('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Agora defina as opções da sua conta a seguir:'))
    acessoDaConta()
}

function acessoDaConta(){
    inquirer.prompt([
        {
            name: 'nomeConta',
            message:'Qual nome o(a) senhor(a) quer da a conta?'
        },
        {
            type: 'list',
            name: 'tipoConta',
            message: 'Qual tipo de conta você quer abrir?',
            choices: [
                'conta corrente',
                'conta salario',
                'poupança'
            ]
        },
        {
            name:'senhaConta',
            message:'Qual a senha?'
        }
    ])
      .then((answer) =>{
        const nomeConta = answer['nomeConta']
        const senhaConta = answer['senhaConta']
        const tipoConta = answer['tipoConta']

        

       
        const conta = {
            name: nomeConta,
            senha: senhaConta,
            saldo: 0,
            tipo: tipoConta,
        }
        try {
           Conta.create(conta)
           console.log(chalk.green('Parabéns, a sua conta foi criada com sucesso!'))
           menu(nomeConta, senhaConta) 
        } catch (error) {
            console.log(error)
        }

       


       
      })
      .catch((err) => console.log(err))
}

function deposito(nomeConta,senhaConta){
    inquirer.prompt([
        {
            name:'valor',
            message:'Quanto o(a) senhor(a) deseja depositar?'
        }
    ])
      .then((answer)=>{
        const valor = answer['valor']
        deposito2(nomeConta,senhaConta, valor)
      })
      .catch((err)=>{console.log(err)})
}
async function deposito2( nomeConta,senhaConta, valor){
    let conta = await Conta.findOne({name:nomeConta})
    conta['saldo'] += Number(valor)

    await Conta.updateOne(conta)
    console.log(chalk.greenBright(`O(a) senhor(a) acabou de depositar R$${valor},00`))
    menu(nomeConta,senhaConta)
    
    
}

 async function consultaSaldo(nomeConta,senhaConta){
    const conta =  await Conta.findOne({name: nomeConta})
    console.log(chalk.greenBright(`seu saldo é de R$${conta['saldo']},00`))
    menu(nomeConta,senhaConta)
}
function sacar(nomeConta,senhaConta){
    inquirer.prompt([
        {
            name:'valor',
            message:'Quanto o(a) senhor(a) quer sacar?'
        }
    ])
      .then((answer)=>{
        const valor = answer['valor']
        sacar2(nomeConta,senhaConta,valor)
      })
      .catch((err)=> console.log(err))
}
async function sacar2(nomeConta,senhaConta,valor){
    let conta = await Conta.findOne({name:nomeConta})
    const cc = conta['saldo']
    if(cc < valor){
        console.log(chalk.redBright('Saldo insuficiente para esse saque! '))
        console.log(chalk.greenBright(`seu saldo é de R$${cc},00`))
        console.log(chalk.grey('tente novamente:'))
        sacar(nomeConta,senhaConta)
    }else{
        conta['saldo'] -= Number(valor)
        await Conta.updateOne(conta)
        console.log(chalk.greenBright(`R$${valor},00 saiu da sua conta!`))
        menu(nomeConta,senhaConta)
    }
}





