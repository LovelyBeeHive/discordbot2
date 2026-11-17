const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const store = require('../utils/store');

module.exports = {
  data: new SlashCommandBuilder().setName('setlog').setDescription('Set the mod-log channel')
    .addChannelOption(o => o.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator).setDMPermission(false),
  async execute(i) {
    const ch = i.options.getChannel('channel');
    store.setLogChannel(i.guild.id, ch.id);
    i.reply(`Mod logs will go to ${ch}.`);
  },
};
