const { Executor, Command } = require('../lib')

const HiCommand = new Command('hi', {
  params: {
    target: String
  },
  
  execute({ target }) {
    console.log(`Hello, ${target}!`)
  }
})

const HelloCommand = new Command('hello', {
  params: {
    targets: {
      type: String,
      isParams: true
    }
  },
  
  execute({ targets }) {
    for (const target of targets) {
      console.log(`Hello, ${target}!`)
    }
  }
})

const executor = new Executor({
  commands: [HiCommand, HelloCommand]
})

executor.execute('hello World Alex Harry Jerry').catch(console.error)
executor.execute('hi everyone').catch(console.error)