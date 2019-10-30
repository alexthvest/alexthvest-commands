module.exports = class Command {
    
    /**
     * 
     * @param {object} options 
     * @param {string | RegExp} options.command
     * @param {Role} [options.role]
     * @param {Array.<string | RegExp>} [options.aliases]
     * @param {object} [options.params]
     * @param {function} [options.execute]
     * @param {Array.<Command>} [options.commands]
     */
    constructor(options) {
        options = options || {};

        if (!options.command) throw new Error('Command must have `command` property');
        if (!options.execute) throw new Error('Command must have `execute` property');
        if (typeof options.execute !== 'function') throw new Error('`execute` property must be a function');

        this.command  = command;
        this.execute  = options.execute;
        
        this.role     = options.role     || null;
        this.aliases  = options.aliases  || [];
        this.params   = options.params   || {};
        this.commands = options.commands || [];
    }

}