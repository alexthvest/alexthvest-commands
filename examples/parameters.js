const { Executor, Command } = require('@alexthvest/commands')

class HelloWorldCommand extends Command {
  patterns = ['hello']
  params = {
    target: String
  }
  
  execute(args, ctx) {
    console.log(`Hello, ${args.target}!`)
  }
}

class SayHiCommand extends Command {
  patterns = ['hi']
  params = {
    targets: [String] // Rest parameter (like js ...args)
  }
  
  execute(args, ctx) {
    for (const target of args.targets) {
      console.log(`Hello, ${target}!`)
    }
  }
}

const executor = new Executor({
  commands: [
    new HelloWorldCommand(),
    new SayHiCommand()
  ]
})

executor.execute('hello World').catch(console.error) // Hello, World!
executor.execute('hello Alex').catch(console.error) // Hello, Alex!

executor.execute('hi World Alex Jessa').catch(console.error)