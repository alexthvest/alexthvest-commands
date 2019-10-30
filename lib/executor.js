const Converter = require('./converter');

module.exports = class Executor {
    
    /**
     * 
     * @param {object} options
     * @param {Role} [options.defaultRole]
     * @param {Array.<Converter>} [options.converters]
     * @param {Array.<Command>} [options.commands]
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
        return this._executeCommand(role, context, args, this.commands);
    }

    /**
     * Execution commands by args
     * @param {Role} role
     * @param {object} context
     * @param {Array.<string>} args 
     * @param {Array.<Command>} commands 
     * @returns {boolean}
     */
    _executeCommand(role, context, args, commands) {
        const string = args[0];
        args         = args.slice(1);
        
        const command = commands.find(command => this._isMatchCommand(string, command));
        if (!command) return false;

        if (!this._executeCommand(role, context, args, command.commands)) {
            if (typeof command.execute !== 'function') return false;

            const canAccess = this._processRole(role, command);
            if (!canAccess) throw new Error(`Access denied`);

            const hasParams = this._hasParams(command);
            if (!hasParams && args.length != Object.keys(command.params).length)
                throw new Error('Parameters count mistmatch');
                
            const params = this._processArgs(command, args);
            command.execute({ ...context, params });
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
     * @param {Array.<string>} args
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
            const type  = this._isParams(param) ? param.type : ('type' in param ? param.type : param);

            const converter = this.converters.find(converter => converter.type === type);
            if (!converter) throw new Error(`Converter for type \`${type}\` is not defined`);

            const value = converter.convert(args[i]);

            if (this._isParams(param)) values[name] = [...(values[name] || []), value];
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
        const params = Object.keys(command.params).filter(name => this._isParams(command.params[name]));
        if (params.length > 1) throw new Error('Command must have only one mixed param');
        return params.length;
    }

    /**
     * Checks if param is 'params'
     * @param {*} param 
     * @returns {boolean}
     * @private
     */
    _isParams(param) {
        return 'isParams' in param ? param.isParams : false;
    }
}