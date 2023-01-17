const calculator = require('../utils/calculator.js');
const Message = require('../utils/message.js');
module.exports = {
    name: 'calculate',
    async execute(message) {
        const result = calculator.calculate(message.content);
        if (result !== undefined) await Message.send(message, message.channel, {content: result});
    }
};
