const { Executor, Command, Converter } = require('../lib')

class User {
  constructor(name) {
    this.name = name
  }
}

const UserConverter = new Converter(User, value => {
  return {
    value: new User(value)
  }
})

const HiCommand = new Command('hi', {
  aliases: ['hello'],
  params: {
    target: User
  },
  
  execute({ target }) {
    console.log(`Hello, ${target.name}!`)
  }
})

const executor = new Executor({
  commands: [HiCommand],
  converters: [UserConverter]
})

executor.execute('hello World').catch(console.error)
executor.execute('hi everyone').catch(console.error)