import { Command } from './command'
import { Converter } from './converter'
import { NumberConverter, StringConverter, BooleanConverter } from './defaults/converters'

export class Executor {
  private readonly _commands: Command[]
  private readonly _converters: Converter[]
  private readonly _middleware: Middleware[] = []

  constructor(options: ExecutorOptions = {}) {
    this._commands = options.commands || []
    this._converters = options.converters || []

    this._converters.push(
      new StringConverter(),
      new NumberConverter(),
      new BooleanConverter()
    )
  }

  public use(middleware: Middleware): Executor {
    this._middleware.push(middleware)
    return this
  }

  public async execute(input: string, ctx: any = null) {
    const args = input.split(' ')
    await this._executeCommands(this._commands, args, ctx)
  }

  private async _executeCommands(commands: Command[], args: string[], ctx: any): Promise<boolean> {
    const pattern = args[0]
    args = args.slice(1)

    const command = commands.find(c => this._isMatch(pattern, c))
    if (!command) return false

    if (!await this._executeCommands(command.commands, args, ctx)) {
      const middleware = [...this._middleware, ctx => command.execute(ctx.args, ctx.ctx)]
      await this._nextMiddleware(middleware, 0, { command, args, ctx })

      return true
    }

    return false
  }

  private async _nextMiddleware(middleware: Middleware[], index: number, ctx: MiddlewareContext) {
    const fn = middleware[index]
    const next = this._nextMiddleware.bind(this, middleware, ++index, ctx)

    if (typeof fn === 'function')
      await fn(ctx, next)
  }

  private _isMatch(pattern: string, command: Command): boolean {
    return command.patterns.some(p => {
      if (typeof p === 'string') return pattern === p
      return pattern.match(p)
    })
  }
}

export interface ExecutorOptions {
  commands?: Command[]
  converters?: Converter[]
}

export interface Middleware {
  (ctx: MiddlewareContext, next: () => void): void
}

export interface MiddlewareContext {
  command: Command,
  args: object,
  ctx: any
}