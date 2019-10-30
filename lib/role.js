module.exports = class Role {

    /**
     * 
     * @param {object} options
     * @param {string} options.name
     * @param {Role[]} [options.extend]
     * @param {Command[]} [options.commands]
     * @constructor
     */
    constructor(options) {
        options = options || {};

        if (!options.name) throw new Error('Role must have `name` property');

        this.name     = options.name;
        this.extend   = options.extend   || [];
        this.commands = options.commands || [];
    }

}