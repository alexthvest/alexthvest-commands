const { Executor, Command } = require('../lib')

const HiCommand = new Command('hi', {
  aliases: ['hello'],
  
  execute() {
    console.log('Hello!')
  }
})

const executor = new Executor({
  commands: [HiCommand]
})

executor.execute('hello').catch(console.error)
executor.execute('hi').catch(console.error)