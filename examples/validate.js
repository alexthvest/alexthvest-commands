const { Executor, Command } = require('../lib')

const HiCommand = new Command('hi', {
  aliases: ['hello'],
  params: {
    target: String
  },
  
  validate({ target }) {
    // if target length < 2 throw error with message
    return target.length < 2 ? 'Target length must be greater than 2' : true
  },
  
  execute({ target }) {
    console.log(`Hello, ${target}!`)
  }
})

const executor = new Executor({
  commands: [HiCommand]
})

executor.execute('hello World').catch(console.error)
executor.execute('hi everyone').catch(console.error)