const Converter = require('./converter');
const { AccessError, ConverterNotFoundError, ParametersCountMistmatch, ParamsError } = require('./errors');

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
     * @param {object} context
     * @returns {Promise}
     * @public
     */
    async execute(string, context) {
        const args = string.split(' ');
        return this._executeCommand(context, args, this.commands);
    }

    /**
     * Execution commands by args
     * @param {object} context
     * @param {string[]} args 
     * @param {Command[]} commands 
     * @returns {boolean}
     */
    _executeCommand(context, args, commands) {
        const string = args[0];
        args         = args.slice(1);
        
        const command = commands.find(command => this._isMatchCommand(string, command));
        if (!command) return false;

        if (!this._executeCommand(context, args, command.commands)) {
            if (typeof command.execute !== 'function') return false;
            
            if (!this._hasParams(command) && args.length != Object.keys(command.params).length)
                throw new ParametersCountMistmatch('Parameters count mistmatch');
                
            const params = this._processArgs(command, args);
            context      = context || {};

            if (!this._checkAccess(command, params, context)) 
                throw new AccessError('Access denied');

            command.execute(params, context);
        }

        return true;
    }

    _checkAccess(command, params, context) {
        if (typeof command.access !== 'function') return true;
        return command.access(params, context);
    }

    /**
     * Processes args
     * @param {Command} command
     * @param {string[]} args
     * @returns {object}
     * @private
     */
    _processArgs(command, args) {
        const values = {};
        const keys   = Object.keys(command.params);

        for (let i = 0; i < args.length; i++) {
            const index = keys.length <= i ? keys.length - 1 : i;
            const name  = keys[index];

            const param = command.params[name];
            const type  = param.isParams ? param.type : ('type' in param ? param.type : param);

            const converter = this.converters.find(converter => converter.type === type);
            if (!converter) throw new ConverterNotFoundError(`Converter for type \`${type}\` is not defined`);

            const value = converter.convert(args[i], context);

            if (param.isParams) values[name] = [...(values[name] || []), value];
            else values[name] = value;
        }

        return values;
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