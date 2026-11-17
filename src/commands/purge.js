const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('purge').setDescription('Bulk delete recent messages (under 14 days old)')
    .addIntegerOption(o => o.setName('amount').setDescription('How many (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages).setDMPermission(false),
  async execute(i) {
    const amount = i.options.getInteger('amount');
    const user = i.options.getUser('user');
    await i.deferReply({ ephemeral: true });
    let msgs = await i.channel.messages.fetch({ limit: 100 });
    if (user) msgs = msgs.filter(m => m.author.id === user.id);
    const deleted = await i.channel.bulkDelete([...msgs.values()].slice(0, amount), true);
    i.editReply(`Deleted ${deleted.size} message(s).`);
  },
};
