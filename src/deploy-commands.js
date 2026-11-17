require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter(f => f.endsWith('.js'))
  .map(f => require(`./commands/${f}`).data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const { CLIENT_ID, GUILD_ID } = process.env;
const route = GUILD_ID ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID) : Routes.applicationCommands(CLIENT_ID);
rest.put(route, { body: commands })
  .then(d => console.log(`Registered ${d.length} commands ${GUILD_ID ? 'to guild' : 'globally'}.`))
  .catch(console.error);
