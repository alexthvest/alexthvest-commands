const { Executor, Command } = require('@alexthvest/commands')
const middleware = require('@alexthvest/commands/middleware')

class HelloWorldCommand extends Command {
  patterns = ['hello', /hi/i]
  
  validate(args, ctx) {
    // returns boolean or string (error message)
    return true
  }
  
  access(args, ctx) {
    // returns boolean or string (error message)
    return true
  }
  
  execute(args, ctx) {
    console.log('Hello, World!')
  }
}

const executor = new Executor({
  commands: [
    new HelloWorldCommand()
  ]
})

executor.use(middleware.accessMiddleware)
executor.use(middleware.validationMiddleware)

executor.execute('hello').catch(console.error)