const Converter = require('./converter');

module.exports = class Executor {
    
    /**
     * 
     * @param {object} options
     * @param {Role} [options.defaultRole]
     * @param {Array.<Converter>} [options.converters]
     * @param {Array.<Command>} [options.commands]
     */
    constructor(options) {
        options = options || {};

        this.defaultRole = options.defaultRole || null;
        this.converters  = options.converters  || [];
        this.commands    = options.commands    || [];

        this.converters.push(
            Convert.String,
            Converter.Boolean,
            Converter.Number
        );
    }

}