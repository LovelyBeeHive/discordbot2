const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkHierarchy } = require('../utils/moderation');
const { modLog } = require('../utils/log');

module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    const err = checkHierarchy(i, member);
    if (err) return i.reply({ content: err, ephemeral: true });
    await member.kick(`${i.user.tag}: ${reason}`);
    await i.reply(`Kicked **${user.tag}**. Reason: ${reason}`);
    modLog(i.guild, { title: 'Kick', fields: [
      { name: 'User', value: `${user.tag} (${user.id})` }, { name: 'Moderator', value: i.user.tag }, { name: 'Reason', value: reason }] });
  },
};
