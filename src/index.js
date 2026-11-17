require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,     // privileged: enable in the Developer Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,   // privileged: enable in the Developer Portal
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.commands = new Collection();
for (const f of fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'))) {
  const cmd = require(`./commands/${f}`);
  client.commands.set(cmd.data.name, cmd);
}
for (const f of fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'))) {
  const ev = require(`./events/${f}`);
  client.on(ev.name, (...args) => ev.execute(...args));
}
client.once('ready', c => console.log(`Logged in as ${c.user.tag}`));
process.on('unhandledRejection', e => console.error('Unhandled rejection:', e));
client.login(process.env.DISCORD_TOKEN);
