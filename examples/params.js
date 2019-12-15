const { Executor, Command } = require('../lib')

const HiCommand = new Command('hi', {
  aliases: ['hello'],
  params: {
    target: String
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