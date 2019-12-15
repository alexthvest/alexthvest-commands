const { Executor, Command } = require('../lib')

const HiCommand = new Command('hi', {
  aliases: ['hello'],
  params: {
    target: String
  },
  
  access(ctx) {
    // if age less than 18 throw error with message 'Access denied'
    return ctx.age >= 18
  },
  
  execute({ target }) {
    console.log(`Hello, ${target}!`)
  }
})

const executor = new Executor({
  commands: [HiCommand]
})

executor.execute('hello World', { age: 16 }).catch(console.error) // Error
executor.execute('hi everyone', { age: 19 }).catch(console.error) // No error