const { Executor, Command } = require('@alexthvest/commands')

class GuildInviteCommand extends Command {
  patterns = ['invite']
  params = {
    userId: Number
  }
  
  execute(args, ctx) {
    // do something
  }
}

class GuildCreateCommand extends Command {
  patterns = ['create']
  params = {
    name: String
  }
  
  execute(args, ctx) {
    // do something
  }
}

class GuildCommand extends Command {
  patterns = ['guild']
  commands = [
    new GuildCreateCommand(),
    new GuildInviteCommand(),
  ]
}

const executor = new Executor({
  commands: [
    new GuildCommand()
  ]
})

executor.execute('guild create Name').catch(console.error)
executor.execute('guild invite 123').catch(console.error)