const { Executor, Command } = require('../lib')

const create = new Command('create', {
  params: {
    name: String
  },
  
  execute({ name }) {
  
  }
})

const invite = new Command('invite', {
  params: {
    userId: Number
  },
  
  execute({ userId }) {
  
  }
})

const guild = new Command('guild', {
  commands: [create, invite]
})

const executor = new Executor({
  commands: [guild]
})

executor.execute('guild create Name').catch(console.error)
executor.execute('guild invite 123').catch(console.error)