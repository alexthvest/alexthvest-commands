const { Executor, Command } = require('@alexthvest/commands')

class HelloWorldCommand extends Command {
  patterns = ['hello', 'hi']
  
  execute(args, ctx) {
    console.log(ctx)
  }
}

const executor = new Executor({
  commands: [
    new HelloWorldCommand()
  ]
})

executor.execute('hello', { name: 'World', time: new Date() }) // { name: ..., time: ... }
  .catch(console.error)