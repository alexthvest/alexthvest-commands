export abstract class Command {
  public abstract patterns: (string | RegExp)[] = []
  public params: CommandParameters = {}
  public commands: Command[] = []

  public async execute(args: object, ctx: any = null) {}
}

export interface CommandParameters {
  [key: string]: any | any[]
}