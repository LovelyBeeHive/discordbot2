const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkHierarchy } = require('../utils/moderation');
const { modLog } = require('../utils/log');
const store = require('../utils/store');

module.exports = {
  data: new SlashCommandBuilder().setName('warn').setDescription('Warn a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason');
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    const err = checkHierarchy(i, member);
    if (err) return i.reply({ content: err, ephemeral: true });
    const count = store.addWarning(i.guild.id, user.id, { reason, mod: i.user.tag });
    await user.send(`You were warned in **${i.guild.name}**: ${reason}`).catch(() => {});
    await i.reply(`Warned **${user.tag}** (warning #${count}). Reason: ${reason}`);
    modLog(i.guild, { title: 'Warning', fields: [
      { name: 'User', value: `${user.tag} (${user.id})` }, { name: 'Total', value: String(count) },
      { name: 'Moderator', value: i.user.tag }, { name: 'Reason', value: reason }] });
  },
};
