const { Executor, Command, Converter } = require('@alexthvest/commands')

class User {
  constructor(name) {
    this.name = name
  }
}

class UserConverter extends Converter {
  type = User
  
  convert(value, ctx) {
    return {
      error: null, // or string if has error
      value: new User(value)
    }
  }
}

class HelloWorldCommand extends Command {
  patterns = ['hello', /hi/i]
  
  params = {
    user: User
  }
  
  execute(args, ctx) {
    console.log(`Hello, ${args.user.name}`)
  }
}

const executor = new Executor({
  commands: [
    new HelloWorldCommand()
  ],
  converters: [
    new UserConverter()
  ]
})

executor.execute('hello Alex').catch(console.error)
executor.execute('hello Jessa').catch(console.error)