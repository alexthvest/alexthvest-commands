module.exports = class Command {

    /**
     * 
     * @param {object} options 
     * @param {string | RegExp} options.command
     * @param {string[] | RegExp[]} [options.aliases]
     * @param {object} [options.params]
     * @param {function(object, object)} [options.execute]
     * @param {function(object, object)} [options.access]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        if (!options.command) throw new Error('Command must have `command` property');

        this.command  = options.command;
        this.execute  = options.execute  || null;
        this.access   = options.access   || null;
        this.aliases  = options.aliases  || [];
        this.params   = options.params   || {};
        this.commands = options.commands || [];
    }

}