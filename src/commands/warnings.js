const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../utils/store');

module.exports = {
  data: new SlashCommandBuilder().setName('warnings').setDescription("View or clear a user's warnings")
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addBooleanOption(o => o.setName('clear').setDescription('Clear all warnings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    if (i.options.getBoolean('clear')) {
      store.clearWarnings(i.guild.id, user.id);
      return i.reply(`Cleared warnings for **${user.tag}**.`);
    }
    const list = store.getWarnings(i.guild.id, user.id);
    if (!list.length) return i.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });
    const text = list.slice(-15).map((w, n) =>
      `**${n + 1}.** <t:${Math.floor(w.at / 1000)}:d> by ${w.mod}: ${w.reason}`).join('\n');
    i.reply({ content: `Warnings for **${user.tag}** (${list.length}):\n${text}`, ephemeral: true });
  },
};
