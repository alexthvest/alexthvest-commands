import { Command } from './command'
import { Converter } from './converter'
import { NumberConverter, StringConverter, BooleanConverter } from './converters'

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
    await this._executeCommand(this._commands, args, ctx)
  }

  private async _executeCommand(commands: Command[], args: string[], ctx: any): Promise<boolean> {
    return false
  }

  private _nextMiddleware(index: number, ctx: MiddlewareContext) {
    const middleware = this._middleware[index]
    const next = this._nextMiddleware.bind(this, ++index, ctx)

    if (typeof middleware !== 'function')
      return middleware;

    middleware(ctx, next)
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