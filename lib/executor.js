const Converter = require('./converter')
const errors = require('./errors')

const NumberConverter = require('./converters/number')
const StringConverter = require('./converters/string')
const BooleanConverter = require('./converters/boolean')

class Executor {
  
  /**
   *
   * @param {object} options
   * @param {Converter[]} [options.converters]
   * @param {Command[]} [options.commands]
   */
  constructor(options = {}) {
    options = options || {}
    
    this.converters = options.converters || []
    this.commands = options.commands || []
    
    this.converters.push(
      new NumberConverter(),
      new StringConverter(),
      new BooleanConverter()
    )
  
    this.converters = this.converters.filter(c =>
      c instanceof Converter &&
      c.type && typeof c.convert === 'function'
    )
  }
  
  /**
   * Executes commands by string
   * @param {string} input
   * @param context
   * @returns {Promise}
   */
  async execute(input, context) {
    const args = input.split(' ')
    await this._executeCommand(context || {}, args, this.commands)
  }
  
  /**
   * Executes commands by args
   * @param context
   * @param {string[]} args
   * @param {Command[]} commands
   * @returns {boolean}
   */
  async _executeCommand(context, args, commands) {
    const string = args[0]
    args = args.slice(1)
    
    const command = commands.find(command => this._isMatchCommand(string, command))
    if (!command) return false
    
    if (!await this._checkAccess(command, context))
      return false
    
    if (!await this._executeCommand(context, args, command.commands)) {
      if (typeof command.execute !== 'function') return false
      
      if (!this._hasParams(command) && args.length !== Object.keys(command.params).length)
        throw new errors.ParametersCountMismatch('Parameters count mismatch')
      
      const params = await this._processArgs(command, args, context)
      command.execute(params, context)
    }
    
    return true
  }
  
  /**
   * Checks access
   * @param {Command} command
   * @param context
   */
  async _checkAccess(command, context) {
    if (typeof command.access !== 'function') return true
    const hasAccess = await command.access(context)
    
    if (typeof hasAccess === 'string') throw new errors.AccessError(hasAccess)
    if (!hasAccess) throw new errors.AccessError('Access denied')
    
    return true
  }
  
  /**
   * Processes args
   * @param {Command} command
   * @param {string[]} args
   * @param context
   * @returns {object}
   */
  async _processArgs(command, args, context) {
    const params = {}
    const keys = Object.keys(command.params)
    
    for (let i = 0; i < args.length; i++) {
      const index = keys.length <= i ? keys.length - 1 : i
      const name = keys[index]
      
      const param = command.params[name]
      const type = param.isParams ? param.type : ('type' in param ? param.type : param)
      
      const converter = this.converters.find(c => c.type === type)
      if (!converter) throw new errors.ConverterNotFoundError(`Converter for type \`${type}\` is not defined`)
      
      const { value, error } = await converter.convert(args[i], context)
      if (error) throw new Error(error)
      
      if (!params.hasOwnProperty(name))
        params[name] = param.isParams ? [] : null
      
      if (param.isParams) params[name].push(value)
      else params[name] = value
    }
    
    await this._validateParams(command, params, context)
    return params
  }
  
  /**
   *
   * @param {Command} command
   * @param {object} params
   * @param context
   */
  async _validateParams(command, params, context) {
    if (typeof command.validate !== 'function') return
    const result = await command.validate(params, context)
  
    if (typeof result === 'string')
      throw new errors.ValidationError(result)
  
    if (!result)
      throw new errors.ValidationError(`Validation error: ${name}`)
  }
  
  /**
   * Checks if string match to command
   * @param {string} string
   * @param {Command} command
   * @returns {boolean}
   */
  _isMatchCommand(string, command) {
    if (!command.aliases) return false
    return command.aliases.some(alias => {
      if (typeof alias === 'string') return string === alias
      if (alias instanceof RegExp) return alias.test(string)
      return false
    })
  }
  
  /**
   * Checks if command has 'params' param
   * @param {Command} command
   * @returns {boolean}
   */
  _hasParams(command) {
    const params = Object.keys(command.params).filter(name => command.params[name].isParams)
    if (params.length > 1) throw new errors.ParamsError('Command must have only one \`params\` param')
    return params.length === 1
  }
}

/**
 *
 * @param {object} options
 * @param {Converter[]} [options.converters]
 * @param {Command[]} [options.commands]
 */
module.exports = function(options = {}) {
  const executor = new Executor(options)
  
  /**
   * Executes commands by string
   * @param {string} input
   * @param context
   * @returns {Promise}
   */
  this.execute = (input, context) =>
    executor.execute(input, context)
}