module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const cmd = interaction.client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(`Error in /${interaction.commandName}:`, err);
      const msg = { content: 'Something went wrong running that command.', ephemeral: true };
      if (interaction.deferred || interaction.replied) interaction.editReply(msg).catch(() => {});
      else interaction.reply(msg).catch(() => {});
    }
  },
};
