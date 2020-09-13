const { readdirSync } = require('fs');

const { prefix, token } = require('./config.json');

const Discord = require('discord.js');

const client = new Discord.Client();

const secondConversion = 1000;

const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity(`${prefix}help`, { type: 'WATCHING' });
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.webhookID) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('lol you need to use this command in a server.');
    }

    if (command.args && !args.length) {
        let reply = 'you need to provide some arguments, are you a noob?';

        if (command.usage) {
            reply += `\nSmfh just use it like this: \`${prefix}${command.name} ${command.usage}\`.`;
        }

        return message.reply(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * secondConversion;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / secondConversion;
            return message.reply(`woaaaaaah slow down, wait ${timeLeft.toFixed(1)} second(s).`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error('Error executing command:', error);
        message.reply('an error occurred trying to execute that command!');
    }
});

client.login(token);