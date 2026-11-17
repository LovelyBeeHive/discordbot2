const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkHierarchy } = require('../utils/moderation');
const { modLog } = require('../utils/log');

module.exports = {
  data: new SlashCommandBuilder().setName('timeout').setDescription('Timeout (mute) a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes (max 40320 = 28 days)').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const mins = i.options.getInteger('minutes');
    const reason = i.options.getString('reason') ?? 'No reason provided';
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    const err = checkHierarchy(i, member);
    if (err) return i.reply({ content: err, ephemeral: true });
    await member.timeout(mins * 60000, `${i.user.tag}: ${reason}`);
    await i.reply(`Timed out **${user.tag}** for ${mins} minute(s). Reason: ${reason}`);
    modLog(i.guild, { title: 'Timeout', fields: [
      { name: 'User', value: `${user.tag} (${user.id})` }, { name: 'Duration', value: `${mins}m` },
      { name: 'Moderator', value: i.user.tag }, { name: 'Reason', value: reason }] });
  },
};
