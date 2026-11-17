# Moderation Bot

Discord moderation bot with anti-spam automod and raid protection (discord.js v14).

## Setup
1. Create an app at https://discord.com/developers/applications, add a Bot, copy the token.
2. Under **Bot**, enable **Server Members Intent** and **Message Content Intent**.
3. `cp .env.example .env` and fill in `DISCORD_TOKEN`, `CLIENT_ID` (and `GUILD_ID` for instant command updates).
4. `npm install`, then `npm run deploy` (registers slash commands), then `npm start`.
5. Invite with scopes `bot applications.commands` and permissions: Ban, Kick, Moderate Members, Manage Messages, Manage Channels, View Channels, Send Messages.
6. **Drag the bot's role above the roles it should moderate**, then run `/setlog #channel`.

## Automod (edit `src/config.js`)
Deletes and punishes: message spam, repeated messages, mass mentions, invite links.
Timeout first, kick after 3 strikes in an hour. Users with Manage Messages are exempt.
Raid protection: a burst of joins turns on raid mode, which kicks brand-new accounts.

## Commands
`/ban /kick /unban /timeout /untimeout /warn /warnings /purge /slowmode /lock /setlog /raidmode`

## About that spam bot
If a bot you didn't add is spamming: Server Settings > Integrations to see/remove it (or kick it),
then Server Settings > Roles to check nobody gave it dangerous permissions. If it was added through
a compromised admin account, have that admin change their password and review authorized apps.
