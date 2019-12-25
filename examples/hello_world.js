const { Executor, Command } = require('@alexthvest/commands')

class HelloWorldCommand extends Command {
  patterns = ['hello', /hi/i]
  
  execute(args, ctx) {
    console.log('Hello, World!')
  }
}

const executor = new Executor({
  commands: [
    new HelloWorldCommand()
  ]
})

executor.execute('hello').catch(console.error)
executor.execute('hi').catch(console.error)