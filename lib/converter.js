class Converter {

    /**
     * 
     * @param {*} type 
     * @param {function(string, object)} handler 
     * @constructor
     */
    constructor(type, handler) {
        if (!type) throw new Error('Converter must have `type`');
        if (!handler) throw new Error('Converter must have `handler`');
        if (typeof handler !== 'function') throw new Error('Handler must be a function');

        this.type    = type;
        this.handler = handler;
    }

    /**
     * Converts a string value to type
     * @param {string} value
     * @public 
     */
    convert(value, context) {
        return this.handler(value, context);
    }

}

Converter.String = new Converter(String, (value, context) => value);
Converter.Number = new Converter(Number, (value, context) => {
    const number = parseFloat(value);
    if (Number.isNaN(number)) throw new Error(`Cannot convert \`${value}\` to number`);
    return number;
});
Converter.Boolean = new Converter(Boolean, (value, context) => {
    if (value.toLowerCase() === 'true'  || value === '1') return true;
    if (value.toLowerCase() === 'false' || value === '0') return false;
    throw new Error(`Cannot convert \`${value}\` to boolean`);
});

module.exports = Converter;