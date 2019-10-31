module.exports = class Command {

    /**
     * 
     * @param {string | RegExp} command
     * @param {object} options 
     * @param {string[] | RegExp[]} [options.aliases]
     * @param {object} [options.params]
     * @param {function(object, object)} [options.execute]
     * @param {function(object, object)} [options.access]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(command, options) {
        options = options || {};

        this.command  = command;
        this.execute  = options.execute  || null;
        this.access   = options.access   || null;
        this.aliases  = options.aliases  || [];
        this.params   = options.params   || {};
        this.commands = options.commands || [];
    }

}