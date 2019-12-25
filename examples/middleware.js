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

executor.use(async (ctx, next) => {
  /**
   * ctx.command = current command
   * ctx.args = already converted args
   * ctx.ctx = context from execute(..., ctx)
   */
  
  // do something...
  console.log(ctx)
  await next()
})

/**
 *  1. Invoking all middleware
 *  2. Invoking command execute method (last middleware)
 */

executor.execute('hello').catch(console.error)