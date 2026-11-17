// Checks shared by commands: can the moderator / bot act on the target?
function checkHierarchy(interaction, member) {
  if (!member) return 'That user is not in this server.';
  if (member.id === interaction.user.id) return "You can't do that to yourself.";
  if (member.id === interaction.guild.ownerId) return "You can't do that to the server owner.";
  if (member.id === interaction.client.user.id) return "I won't do that to myself.";
  const mod = interaction.member;
  if (interaction.user.id !== interaction.guild.ownerId &&
      member.roles.highest.position >= mod.roles.highest.position)
    return 'That user has an equal or higher role than you.';
  if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position)
    return 'That user has an equal or higher role than me. Move my role higher.';
  return null;
}
module.exports = { checkHierarchy };
