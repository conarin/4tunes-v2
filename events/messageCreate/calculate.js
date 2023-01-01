const calculator = require('../../utils/calculator.js');
module.exports = {
    name: 'calculate',
    async execute(message) {
        const result = calculator.calculate(message.content);
        if (result === undefined) return;
        return {
            content: result
        };
    }
};
