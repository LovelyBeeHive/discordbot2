const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('lock').setDescription('Lock or unlock this channel for @everyone')
    .addBooleanOption(o => o.setName('unlock').setDescription('Unlock instead of lock'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels).setDMPermission(false),
  async execute(i) {
    const unlock = i.options.getBoolean('unlock') ?? false;
    await i.channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: unlock ? null : false });
    i.reply(unlock ? 'Channel unlocked.' : 'Channel locked.');
  },
};
