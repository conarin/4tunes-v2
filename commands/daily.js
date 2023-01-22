const { SlashCommandBuilder } = require('discord.js');
const Interaction = require('../utils/interaction.js');
const fourTunesAPI = require("../utils/4TunesAPI");
const exp = require("../utils/exp.js");
const levelUp = require("../utils/levelUp");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('ログインボーナスを受け取る')
        .setDMPermission(false),
    async execute(interaction) {
        // ギルド・メンバーデータを取得
        const data = {};

        data.guildData = await fourTunesAPI.fetch('/guilds', interaction.guild.id, {
            guild_id: interaction.guild.id
        });
        if (data.guildData === undefined) return;

        data.memberData = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/members`, interaction.user.id, {
            user_id: interaction.user.id
        });
        if (data.memberData === undefined) return;

        // ポイントトランザクションを取得
        const memberPointTransactions = await fourTunesAPI.fetch(`/guilds/${interaction.guild.id}/members`, `${interaction.user.id}/points`);
        if (memberPointTransactions === undefined) return;

        const currentDate = new Date();
        // 前回のログイン日時
        const lastLoginDate = new Date(memberPointTransactions.find(transaction => transaction.reason === 'dailyコマンド')?.created_at || 0);
        // 次回ログイン日時
        const nextLoginDate = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate() + 1, 0, 0, 0, 0);

        // 現在時刻がログイン可能日時より前なら
        if (currentDate < nextLoginDate) {
            await Interaction.reply(interaction, {
                embeds: [{
                    title: '本日は既に受け取っています',
                    description: `${Math.floor((nextLoginDate - currentDate) / 360000) / 10}時間後に再び受け取ることができます。`,
                    color: client.colors.orange
                }]
            });
            return;
        }

        // 連続ログイン判定
        // 前回のdailyコマンド実行日と昨日が同じ日付なら連続
        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, 0, 0, 0, 0),
            lastLoginDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate(), 0, 0, 0, 0);
        let continuous = 1;
        if (yesterday - lastLoginDay === 0) continuous = data.memberData.chain_login + 1;
        // 連続ログインを更新する
        await fourTunesAPI.patch(`/guilds/${interaction.guild.id}/members/${interaction.user.id}`, {
            chain_login: continuous
        });

        // -5~6ポイントランダムに付与
        let loginBonus = Math.floor(Math.random() * 12) - 5;
        // 5日連続ログインの場合10ポイント加算
        if (continuous % 5 === 0) loginBonus += 10;
        await fourTunesAPI.post(`/guilds/${interaction.guild.id}/members/${interaction.user.id}/points`, {
            channel_id: interaction.channel.id,
            message_id: null,
            amount: loginBonus,
            reason: 'dailyコマンド'
        });

        // 同量の経験値を付与
        let increaseExp = Math.abs(loginBonus);
        if (loginBonus > 0) increaseExp = Math.floor(loginBonus * exp.magnification(data.memberData.exp));
        await fourTunesAPI.post(`/guilds/${interaction.guild.id}/members/${interaction.user.id}/exp`, {
            channel_id: interaction.channel.id,
            message_id: null,
            amount: increaseExp,
            reason: 'dailyコマンド'
        });

        await Interaction.reply(interaction, {
            embeds: [{
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({format: 'png', dynamic: true, size:2048})
                },
                description: `🎁 **${loginBonus}**ポイントゲット 🎁`,
                fields: [
                    {
                        name: 'point',
                        value: `${data.memberData.point_balance}→**${data.memberData.point_balance + loginBonus}**`
                    },
                    {
                        name: 'xp',
                        value: `${data.memberData.exp}→**${data.memberData.exp + increaseExp}**`
                    }
                ],
                footer: {
                    text: `${continuous}日連続受け取り`
                }
            }]
        });

        const message = {
            guild: interaction.guild,
            channel: interaction.channel,
            author: interaction.user,
            id: null
        }
        data.memberData.point_balance += loginBonus;
        await levelUp.execute(message, data, increaseExp);
    }
};