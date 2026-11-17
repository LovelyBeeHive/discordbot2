const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const raid = require('../utils/raid');

module.exports = {
  data: new SlashCommandBuilder().setName('raidmode').setDescription('Manually toggle raid mode (kicks brand-new accounts that join)')
    .addBooleanOption(o => o.setName('on').setDescription('Turn on or off').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator).setDMPermission(false),
  async execute(i) {
    const on = i.options.getBoolean('on');
    raid.setRaidMode(i.guild.id, on);
    i.reply(`Raid mode ${on ? 'ENABLED' : 'disabled'}.`);
  },
};
