const Converter = require('./converter');
const { AccessError, ConverterNotFoundError, ParametersCountMistmatch, ParamsError } = require('./errors');

module.exports = class Executor {
    
    /**
     * 
     * @param {object} options
     * @param {Role} [options.defaultRole]
     * @param {Converter[]} [options.converters]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        this.defaultRole = options.defaultRole || null;
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
     * @param {Role} role 
     * @param {object} context
     * @returns {Promise}
     * @public
     */
    async execute(string, role, context) {
        const args = string.split(' ');
        return this._executeCommand({ role, context, args, commands: this.commands });
    }

    /**
     * Execution commands by args
     * @param {Role} role
     * @param {object} context
     * @param {string[]} args 
     * @param {Command[]} commands 
     * @returns {boolean}
     */
    _executeCommand({ role, context, args, commands }) {
        const string = args[0];
        args         = args.slice(1);
        
        const command = commands.find(command => this._isMatchCommand(string, command));
        if (!command) return false;

        if (!this._executeCommand({ role, context, args, commands: command.commands })) {
            if (typeof command.execute !== 'function') return false;

            const canAccess = this._processRole(role, command);
            if (!canAccess) throw new Error('Access denied');

            const hasParams = this._hasParams(command);
            if (!hasParams && args.length != Object.keys(command.params).length)
                throw new Error('Parameters count mistmatch');
                
            const params = this._processArgs(command, args);
            context      = context || {};

            command.execute({ context, params });
        }

        return true;
    }

    /**
     * Checks if you can access to command
     * @param {Role} role 
     * @param {Command} command 
     * @returns {boolean}
     * @private
     */
    _processRole(role, command) {
        role = role || this.defaultRole;
        return role && (
            role.commands.includes(command) || 
            role.extend.some(role => role.commands.includes(command))
        );
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
            if (!converter) throw new Error(`Converter for type \`${type}\` is not defined`);

            const value = converter.convert(args[i]);

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
        if (string.match(command.command)) return true;
        return command.aliases.some(alias => string.match(alias));  
    }

    /**
     * Checks if command has 'params' param
     * @param {Command} command 
     * @returns {boolean}
     * @private
     */
    _hasParams(command) {
        const params = Object.keys(command.params).filter(name =>command.params[name].isParams);
        if (params.length > 1) throw new Error('Command must have only one \`params\` param');
        return params.length;
    }
}