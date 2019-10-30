module.exports = class Command {

    /**
     * 
     * @param {object} options 
     * @param {string | RegExp} options.command
     * @param {string[] | RegExp[]} [options.aliases]
     * @param {object} [options.params]
     * @param {function(object)} [options.execute]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        if (!options.command) throw new Error('Command must have `command` property');

        this.command  = options.command;
        this.execute  = options.execute  || null;
        this.aliases  = options.aliases  || [];
        this.params   = options.params   || {};
        this.commands = options.commands || [];
    }

}