const Converter = require('./converter');
const { 
    AccessError, 
    ConverterNotFoundError, 
    ParametersCountMistmatch, 
    ParamsError, 
    ValidationError 
} = require('./errors');

module.exports = class Executor {
    
    /**
     * 
     * @param {object} options
     * @param {Converter[]} [options.converters]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        this.converters  = options.converters  || [];
        this.commands    = options.commands    || [];

        this.converters.push(
            Converter.String,
            Converter.Boolean,
            Converter.Number
        );
    }

    /**
     * Executing commands by string
     * @param {string} string 
     * @param {*} context
     * @returns {Promise}
     * @public
     */
    async execute(string, context) {
        const args = string.split(' ');
        await this._executeCommand(context, args, this.commands);
    }

    /**
     * Execution commands by args
     * @param {*} context
     * @param {string[]} args 
     * @param {Command[]} commands 
     * @returns {boolean}
     */
    async _executeCommand(context, args, commands) {
        const string = args[0];
        args         = args.slice(1);
        
        const command = commands.find(command => this._isMatchCommand(string, command));
        if (!command) return false;

        if (!await this._executeCommand(context, args, command.commands)) {
            if (typeof command.execute !== 'function') return false;
            
            if (!this._hasParams(command) && args.length != Object.keys(command.params).length)
                throw new ParametersCountMistmatch('Parameters count mistmatch');
                
            const params = await this._processArgs(command, args, context);
            context      = context || {};

            await this._checkAccess(command, params, context);
            command.execute(params, context);
        }

        return true;
    }

    /**
     * Checks access
     * @param {Command} command 
     * @param {object} params 
     * @param {*} context 
     */
    async _checkAccess(command, params, context) {
        if (typeof command.access !== 'function') return true;
        const hasAccess = await command.access(params, context);

        if (typeof hasAccess === 'string') throw new AccessError(hasAccess);
        if (typeof hasAccess === 'boolean' && hasAccess) return true;
        if (typeof hasAccess === 'boolean' && !hasAccess) throw new AccessError('Access denied');

        throw new Error('access method must return boolean or string');
    }

    /**
     * Processes args
     * @param {Command} command
     * @param {string[]} args
     * @param {*} context
     * @returns {object}
     * @private
     */
    async _processArgs(command, args, context) {
        const values = {};
        const keys   = Object.keys(command.params);

        for (let i = 0; i < keys.length; i++) {
            const name  = keys[i];
            if (command.params[name].isParams) values[name] = [];
            else values[name] = null;
        }

        for (let i = 0; i < args.length; i++) {
            const index = keys.length <= i ? keys.length - 1 : i;
            const name  = keys[index];

            const param = command.params[name];
            const type  = param.isParams ? param.type : ('type' in param ? param.type : param);

            const converter = this.converters.find(converter => converter.type === type);
            if (!converter) throw new ConverterNotFoundError(`Converter for type \`${type}\` is not defined`);

            const value = await converter.convert(args[i], context);

            if (param.isParams) values[name].push(value);
            else values[name] = value;
        }
        
        await this._validateParams(command.params, values, context);
        return values;
    }

    /**
     * 
     * @param {object} params 
     * @param {*} context 
     */
    async _validateParams(params, values, context) {
        for (const name in params) {
            const param = params[name];
            const value = values[name];

            if (typeof param.validate !== 'function') continue;
            const validate = await param.validate(value, context);

            if (typeof validate === 'string')
                throw new ValidationError(validate);

            if (typeof validate === 'boolean' && !validate) 
                throw new ValidationError(`Validation error: ${name}`);
        }
    }

    /**
     * Checks if string match to command
     * @param {string} string 
     * @param {Command} command 
     * @returns {boolean}
     * @private
     */
    _isMatchCommand(string, command) {
        if (!command.command) return false;
        
        if (typeof command.command === 'string' &&  string === command.command) return true;
        if (command.command instanceof RegExp && command.command.test(string)) return true;

        return command.aliases.some(alias => {
            if (typeof alias === 'string') return string === alias;
            if (alias instanceof RegExp) return alias.test(string);
            return false;
        });  
    }

    /**
     * Checks if command has 'params' param
     * @param {Command} command 
     * @returns {boolean}
     * @private
     */
    _hasParams(command) {
        const params = Object.keys(command.params).filter(name =>command.params[name].isParams);
        if (params.length > 1) throw new ParamsError('Command must have only one \`params\` param');
        return params.length;
    }
}