// Copy this file, rename it (no leading underscore), and edit it. The bot loads it automatically.
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')                       // the /name users type (lowercase, no spaces)
    .setDescription('Says hello')
    // .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true))
    // .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) // restrict to mods
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.reply(`Hello ${interaction.user}!`);
  },
};
