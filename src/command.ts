export abstract class Command {
  public abstract patterns: (string | RegExp)[] = []
  public params: { [key: string]: any | any[] } = {}
  public commands: Command[] = []

  public async execute(args: object, ctx: any = null) {}
}