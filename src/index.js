require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

// ====== PUT YOUR BOT TOKEN HERE ======
// WARNING: never commit your real token to GitHub (Discord will reset it).
// Paste it only in the copy you run on your host.
const TOKEN = 'PASTE_YOUR_TOKEN_HERE';
// Optional: your server ID. Commands then update instantly (global ones can take up to an hour).
const GUILD_ID = '';
// =====================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,     // privileged: enable in the Developer Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,   // privileged: enable in the Developer Portal
  ],
  partials: [Partials.Message, Partials.Channel],
});

// Load every .js file in src/commands (files starting with "_" are skipped).
// To add a command: copy src/commands/_template.js, rename it, edit it. No other changes needed.
client.commands = new Collection();
const commandsDir = path.join(__dirname, 'commands');
for (const f of fs.readdirSync(commandsDir).filter(f => f.endsWith('.js') && !f.startsWith('_'))) {
  try {
    const cmd = require(path.join(commandsDir, f));
    if (!cmd.data || typeof cmd.execute !== 'function') throw new Error('must export { data, execute }');
    client.commands.set(cmd.data.name, cmd);
  } catch (e) {
    console.error(`Skipped commands/${f}: ${e.message}`);
  }
}

for (const f of fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'))) {
  const ev = require(`./events/${f}`);
  client.on(ev.name, (...args) => ev.execute(...args));
}

client.once('ready', async c => {
  console.log(`Logged in as ${c.user.tag}`);
  // Register slash commands automatically on every start (no separate deploy step needed).
  const body = [...client.commands.values()].map(cmd => cmd.data.toJSON());
  try {
    if (GUILD_ID) await c.application.commands.set(body, GUILD_ID);
    else await c.application.commands.set(body);
    console.log(`Registered ${body.length} commands ${GUILD_ID ? 'to guild' : 'globally'}.`);
  } catch (e) { console.error('Failed to register commands:', e); }
});

process.on('unhandledRejection', e => console.error('Unhandled rejection:', e));
client.login(process.env.DISCORD_TOKEN || TOKEN);
