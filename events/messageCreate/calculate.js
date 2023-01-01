const calculator = require('../../utils/calculator.js');
const sendMessage = require('../../utils/sendMessage.js');
module.exports = {
    name: 'calculate',
    async execute(message) {
        const result = calculator.calculate(message.content);
        if (result !== undefined) await sendMessage.send(message, {content: result});
    }
};
