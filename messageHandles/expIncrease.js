const exp = require("../utils/exp.js");
const fourTunesAPI = require("../utils/4TunesAPI");
const levelUp = require("../utils/levelUp");
module.exports = {
    name: 'expIncrease',
    guildOnly: true,
    async execute(message, data) {
        // 10回発言するごとに経験値を「10*レベルに応じた倍率」増やす
        if ((data.memberData.message_count + 1) % 10 !== 0) return;

        // 増加する経験値量
        const increaseExp = Math.floor(10 * exp.magnification(data.memberData.exp));

        // 経験値履歴に追加
        await fourTunesAPI.post(`/guilds/${message.guild.id}/members/${message.author.id}/exp`, {
            channel_id: message.channel.id,
            message_id: message.id,
            amount: increaseExp,
            reason: '10回発言したため'
        });

        await levelUp.execute(message, data, increaseExp);
    }
};
