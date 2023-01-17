const exp = require("./exp");
const fourTunesAPI = require("./4TunesAPI");
const Message = require("./message");
module.exports = {
    async execute(message, data, increaseExp = 0) {
        // レベルアップしたら
        const previousLevel = exp.toLevel(data.memberData.exp),
            currentLevel = exp.toLevel(data.memberData.exp + increaseExp);
        if (previousLevel >= currentLevel) return;

        // レベルアップ報酬を与える
        await fourTunesAPI.post(`/guilds/${message.guild.id}/members/${message.author.id}/points`, {
            channel_id: message.channel.id,
            message_id: message.id,
            amount: 100,
            reason: 'レベルアップ報酬'
        });

        // 通知設定がfalseなら早期リターン
        if (!data.guildData.level_up_notice_channel_id || !data.memberData.is_notify) return;

        let sendChannel = message.channel;
        if (data.guildData.level_up_notice_channel_id !== '1') {
            const channel = await client.channels.fetch(data.guildData.level_up_notice_channel_id)
                .catch(error => {
                    console.log('例外のため現在のチャンネルにレベルアップ通知をする');
                    console.error(error);
                });
            if (channel) sendChannel = channel;
        }

        const embed = {
            color: client.colors.success,
            title:'ﾑﾑｯwwwwwwwﾚﾍﾞﾙｱｯﾌﾟwwwwwww',
            description: `Level${previousLevel}→Level${currentLevel}:tada:\n` +
                `${data.memberData.point_balance}pt→${data.memberData.point_balance+100}pt`,
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size:2048 }),
            },
            thumbnail: {
                url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size:2048 })
            }
        };

        const options = {
            embeds: [embed],
        };

        await Message.send(message, sendChannel, options);
    }
};
