const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { checkHierarchy } = require('../utils/moderation');

module.exports = {
  data: new SlashCommandBuilder().setName('untimeout').setDescription('Remove a timeout')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).setDMPermission(false),
  async execute(i) {
    const user = i.options.getUser('user');
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    const err = checkHierarchy(i, member);
    if (err) return i.reply({ content: err, ephemeral: true });
    await member.timeout(null);
    await i.reply(`Removed timeout from **${user.tag}**.`);
  },
};
