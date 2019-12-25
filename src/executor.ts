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
    if (!input) return

    const args = input.trim().split(' ')
    await this._executeCommands(this._commands, args, ctx)
  }

  private async _executeCommands(commands: Command[], args: string[], ctx: any): Promise<boolean> {
    if (!commands || !args) return false

    let processedArgs = {}
    const pattern = args[0]
    args = args.slice(1)

    const command = commands.find(c => this._isMatch(pattern, c))
    if (!command) return false

    if (!await this._executeCommands(command.commands, args, ctx)) {
      if (typeof command.execute !== 'function') return false

      if (command.params && typeof command.params === 'object')
        processedArgs = await this._processArgs(command, args, ctx)

      const middleware = [...this._middleware, ctx => command.execute(ctx.args, ctx.ctx)]
      await this._nextMiddleware(middleware, 0, {
        command,
        args: processedArgs,
        ctx,
      })

      return true
    }

    return false
  }

  private async _processArgs(command: Command, args: string[], ctx: any): Promise<object> {
    const processedArgs = {}
    const keys = Object.keys(command.params)

    if (!this._hasRestParams(command) && args.length !== keys.length)
      throw new Error('Parameters count mismatch')

    for (let i = 0; i < keys.length; i++) {
      const param = { name: keys[i], type: command.params[keys[i]] }
      processedArgs[param.name] = Array.isArray(param.type) ? [] : null
    }

    for (let i = 0; i < args.length; i++) {
      const index = keys.length <= i ? keys.length - 1 : i
      const param = { name: keys[index], type: command.params[keys[index]], isParams: false }

      if (Array.isArray(param.type)) {
        param.type = param.type[0]
        param.isParams = true
      }

      const converter = this._converters.find(c => c.hasOwnProperty('type') && c.type === param.type)
      if (!converter) throw new Error(`Converter for type \`${param.type}\` is not defined`)

      const { value, error } = await converter.convert(args[i], ctx)
      if (error) throw new Error(error)

      if (param.isParams) processedArgs[param.name].push(value)
      else processedArgs[param.name] = value
    }

    return processedArgs
  }

  private async _nextMiddleware(middleware: Middleware[], index: number, ctx: MiddlewareContext) {
    const fn = middleware[index]
    const next = this._nextMiddleware.bind(this, middleware, ++index, ctx)

    if (typeof fn === 'function')
      await fn(ctx, next)
  }

  private _isMatch(pattern: string, command: Command): boolean {
    return command instanceof Command &&
      Array.isArray(command.patterns) &&
      command.patterns.some(p => {
        if (typeof p === 'string') return pattern === p
        return pattern.match(p)
      })
  }

  private _hasRestParams(command: Command): boolean {
    if (!command.params) return false

    const values = Object.values(command.params).filter(v => Array.isArray(v))
    if (values.length > 1) throw new Error('Command must have only one rest param')

    return values.length === 1
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