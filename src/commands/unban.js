const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modLog } = require('../utils/log');

module.exports = {
  data: new SlashCommandBuilder().setName('unban').setDescription('Unban a user by ID')
    .addStringOption(o => o.setName('user_id').setDescription('User ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).setDMPermission(false),
  async execute(i) {
    const id = i.options.getString('user_id');
    try { await i.guild.members.unban(id); }
    catch { return i.reply({ content: 'That user is not banned (or the ID is invalid).', ephemeral: true }); }
    await i.reply(`Unbanned <@${id}>.`);
    modLog(i.guild, { title: 'Unban', color: 0x2ecc71, fields: [{ name: 'User ID', value: id }, { name: 'Moderator', value: i.user.tag }] });
  },
};
