const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkHierarchy } = require('../utils/moderation');
const { modLog } = require('../utils/log');

module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .addIntegerOption(o => o.setName('delete_days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    const days = i.options.getInteger('delete_days') ?? 1;
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    if (member) {
      const err = checkHierarchy(i, member);
      if (err) return i.reply({ content: err, ephemeral: true });
    }
    await i.guild.members.ban(user, { reason: `${i.user.tag}: ${reason}`, deleteMessageSeconds: days * 86400 });
    await i.reply(`Banned **${user.tag}**. Reason: ${reason}`);
    modLog(i.guild, { title: 'Ban', color: 0xe74c3c, fields: [
      { name: 'User', value: `${user.tag} (${user.id})` }, { name: 'Moderator', value: i.user.tag }, { name: 'Reason', value: reason }] });
  },
};
