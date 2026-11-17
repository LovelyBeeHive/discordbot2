const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('slowmode').setDescription('Set channel slowmode')
    .addIntegerOption(o => o.setName('seconds').setDescription('0 to turn off (max 21600)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels).setDMPermission(false),
  async execute(i) {
    const s = i.options.getInteger('seconds');
    await i.channel.setRateLimitPerUser(s);
    i.reply(s ? `Slowmode set to ${s}s.` : 'Slowmode disabled.');
  },
};
